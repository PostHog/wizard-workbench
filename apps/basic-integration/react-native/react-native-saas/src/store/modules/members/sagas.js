import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import toast from '../../../services/toast';
import api from '../../../services/api';
import posthog, { captureException } from '../../../services/posthog';
import { isDemoMode, demoMembers } from '../../../services/demoData';

import { getMembersSuccess, inviteMemberSuccess } from './actions';

export function* getMembers() {
  const token = yield select(state => state.auth.token);
  const team = yield select(state => state.teams.active);

  // Demo mode
  if (isDemoMode(token)) {
    const members = team ? (demoMembers[team.slug] || []) : [];
    posthog.capture('members_loaded', {
      source: 'demo',
      member_count: members.length,
      active_team_slug: team?.slug,
    });
    yield put(getMembersSuccess(members));
    return;
  }

  const response = yield call(api.get, 'members');

  posthog.capture('members_loaded', {
    source: 'api',
    member_count: response.data.length,
    active_team_slug: team?.slug,
  });

  yield put(getMembersSuccess(response.data));
}

export function* updateMember({ payload }) {
  const { id, roles } = payload;
  const token = yield select(state => state.auth.token);

  try {
    // Demo mode
    if (isDemoMode(token)) {
      posthog.capture('member_role_updated', {
        source: 'demo',
        member_id: id,
        role_count: roles.length,
      });
      toast.showSuccess('Member updated');
      return;
    }

    yield call(api.put, `members/${id}`, { roles: roles.map(role => role.id) });

    posthog.capture('member_role_updated', {
      source: 'api',
      member_id: id,
      role_count: roles.length,
    });

    toast.showSuccess('Member updated');
  } catch (err) {
    captureException(err, {
      area: 'members',
      action: 'update_member_roles',
    });
    toast.showError('Error updating member');
  }
}

export function* inviteMember({ payload }) {
  const { email } = payload;
  const token = yield select(state => state.auth.token);

  try {
    // Demo mode - add member directly to the list
    if (isDemoMode(token)) {
      const name = email.split('@')[0].replace(/[._]/g, ' ');
      const newMember = {
        id: Date.now(),
        user: { name, email },
        roles: [{ id: 3, name: 'Viewer' }],
      };
      posthog.capture('member_invited', {
        source: 'demo',
        invitee_domain: email.split('@')[1],
      });
      yield put(inviteMemberSuccess(newMember));
      toast.showSuccess('Member added');
      return;
    }

    yield call(api.post, 'invites', { invites: [email] });

    posthog.capture('member_invited', {
      source: 'api',
      invitee_domain: email.split('@')[1],
    });

    toast.showSuccess('Invite sent');
  } catch (err) {
    captureException(err, {
      area: 'members',
      action: 'invite_member',
    });
    toast.showError('Error sending invite');
  }
}

export default all([
  takeLatest('@members/GET_MEMBERS_REQUEST', getMembers),
  takeLatest('@members/UPDATE_MEMBER_REQUEST', updateMember),
  takeLatest('@members/INVITE_MEMBER_REQUEST', inviteMember),
]);
