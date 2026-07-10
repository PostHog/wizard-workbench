import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import toast from '../../../services/toast';
import api from '../../../services/api';
import { isDemoMode, demoMembers } from '../../../services/demoData';
import { trackEvent, trackException } from '../../../services/posthogTracking';
import { sanitizeEmailDomain } from '../../../services/posthog';

import { getMembersSuccess, inviteMemberSuccess } from './actions';

export function* getMembers() {
  const token = yield select(state => state.auth.token);
  const team = yield select(state => state.teams.active);

  // Demo mode
  if (isDemoMode(token)) {
    const members = team ? (demoMembers[team.slug] || []) : [];
    yield put(getMembersSuccess(members));
    return;
  }

  const response = yield call(api.get, 'members');

  yield put(getMembersSuccess(response.data));
}

export function* updateMember({ payload }) {
  const { id, roles } = payload;
  const token = yield select(state => state.auth.token);
  const team = yield select(state => state.teams.active);

  try {
    // Demo mode
    if (isDemoMode(token)) {
      yield call(trackEvent, 'member_role_updated', {
        member_id: String(id),
        role_count: roles.length,
        team_slug: team?.slug,
        update_source: 'demo_mode',
      });
      toast.showSuccess('Member updated');
      return;
    }

    yield call(api.put, `members/${id}`, { roles: roles.map(role => role.id) });
    yield call(trackEvent, 'member_role_updated', {
      member_id: String(id),
      role_count: roles.length,
      team_slug: team?.slug,
      update_source: 'api',
    });

    toast.showSuccess('Member updated');
  } catch (err) {
    yield call(trackEvent, 'member_role_update_failed', {
      member_id: String(id),
      role_count: roles.length,
      team_slug: team?.slug,
    });
    yield call(trackException, err, {
      source: 'member_role_update',
      member_id: String(id),
      team_slug: team?.slug,
    });
    toast.showError('Error updating member');
  }
}

export function* inviteMember({ payload }) {
  const { email } = payload;
  const token = yield select(state => state.auth.token);
  const team = yield select(state => state.teams.active);

  try {
    // Demo mode - add member directly to the list
    if (isDemoMode(token)) {
      const name = email.split('@')[0].replace(/[._]/g, ' ');
      const newMember = {
        id: Date.now(),
        user: { name, email },
        roles: [{ id: 3, name: 'Viewer' }],
      };
      yield put(inviteMemberSuccess(newMember));
      yield call(trackEvent, 'member_invited', {
        invitation_channel: 'demo_mode',
        member_id: String(newMember.id),
        email_domain: sanitizeEmailDomain(email),
        team_slug: team?.slug,
      });
      toast.showSuccess('Member added');
      return;
    }

    yield call(api.post, 'invites', { invites: [email] });
    yield call(trackEvent, 'member_invited', {
      invitation_channel: 'api',
      email_domain: sanitizeEmailDomain(email),
      team_slug: team?.slug,
    });

    toast.showSuccess('Invite sent');
  } catch (err) {
    yield call(trackEvent, 'member_invitation_failed', {
      email_domain: sanitizeEmailDomain(email),
      team_slug: team?.slug,
    });
    yield call(trackException, err, {
      source: 'member_invite',
      team_slug: team?.slug,
    });
    toast.showError('Error sending invite');
  }
}

export default all([
  takeLatest('@members/GET_MEMBERS_REQUEST', getMembers),
  takeLatest('@members/UPDATE_MEMBER_REQUEST', updateMember),
  takeLatest('@members/INVITE_MEMBER_REQUEST', inviteMember),
]);
