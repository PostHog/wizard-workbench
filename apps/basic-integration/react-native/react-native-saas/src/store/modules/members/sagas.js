import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import toast from '../../../services/toast';
import api from '../../../services/api';
import { isDemoMode, demoMembers } from '../../../services/demoData';
import { posthog } from '../../../config/posthog';

import { getMembersSuccess, inviteMemberSuccess } from './actions';

export function* getMembers() {
  const token = yield select((state) => state.auth.token);
  const team = yield select((state) => state.teams.active);

  // Demo mode
  if (isDemoMode(token)) {
    const members = team ? demoMembers[team.slug] || [] : [];
    yield put(getMembersSuccess(members));
    return;
  }

  const response = yield call(api.get, 'members');

  yield put(getMembersSuccess(response.data));
}

export function* updateMember({ payload }) {
  const { id, roles } = payload;
  const token = yield select((state) => state.auth.token);

  try {
    // Demo mode
    if (isDemoMode(token)) {
      posthog.capture('member_role_updated', {
        member_id: id,
        role_count: roles.length,
        is_demo: true,
      });
      toast.showSuccess('Member updated');
      return;
    }

    yield call(api.put, `members/${id}`, {
      roles: roles.map((role) => role.id),
    });
    posthog.capture('member_role_updated', {
      member_id: id,
      role_count: roles.length,
      is_demo: false,
    });

    toast.showSuccess('Member updated');
  } catch (err) {
    posthog.captureException(err, {
      action: 'update_member_role',
      member_id: id,
    });
    posthog.capture('member_role_update_failed', { member_id: id });
    toast.showError('Error updating member');
  }
}

export function* inviteMember({ payload }) {
  const { email } = payload;
  const token = yield select((state) => state.auth.token);

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
      posthog.capture('member_invited', { is_demo: true });
      toast.showSuccess('Member added');
      return;
    }

    yield call(api.post, 'invites', { invites: [email] });
    posthog.capture('member_invited', { is_demo: false });

    toast.showSuccess('Invite sent');
  } catch (err) {
    posthog.captureException(err, { action: 'invite_member' });
    posthog.capture('member_invite_failed');
    toast.showError('Error sending invite');
  }
}

export default all([
  takeLatest('@members/GET_MEMBERS_REQUEST', getMembers),
  takeLatest('@members/UPDATE_MEMBER_REQUEST', updateMember),
  takeLatest('@members/INVITE_MEMBER_REQUEST', inviteMember),
]);
