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
  const team = yield select((state) => state.teams.active);

  try {
    // Demo mode
    if (isDemoMode(token)) {
      toast.showSuccess('Member updated');
      posthog.capture('member_role_updated', {
        member_id: id,
        role_names: roles.map((r) => r.name),
        team_id: team?.id,
        is_demo: true,
      });
      return;
    }

    yield call(api.put, `members/${id}`, {
      roles: roles.map((role) => role.id),
    });

    toast.showSuccess('Member updated');
    posthog.capture('member_role_updated', {
      member_id: id,
      role_names: roles.map((r) => r.name),
      team_id: team?.id,
      is_demo: false,
    });
  } catch (err) {
    toast.showError('Error updating member');
    posthog.capture('member_role_update_failed', {
      member_id: id,
      team_id: team?.id,
      $exception_type: err?.name,
      $exception_message: err?.message,
    });
  }
}

export function* inviteMember({ payload }) {
  const { email } = payload;
  const token = yield select((state) => state.auth.token);
  const team = yield select((state) => state.teams.active);

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
      toast.showSuccess('Member added');
      posthog.capture('member_invited', {
        email,
        team_id: team?.id,
        is_demo: true,
      });
      return;
    }

    yield call(api.post, 'invites', { invites: [email] });

    toast.showSuccess('Invite sent');
    posthog.capture('member_invited', {
      email,
      team_id: team?.id,
      is_demo: false,
    });
  } catch (err) {
    toast.showError('Error sending invite');
    posthog.capture('member_invite_failed', {
      email,
      team_id: team?.id,
      $exception_type: err?.name,
      $exception_message: err?.message,
    });
  }
}

export default all([
  takeLatest('@members/GET_MEMBERS_REQUEST', getMembers),
  takeLatest('@members/UPDATE_MEMBER_REQUEST', updateMember),
  takeLatest('@members/INVITE_MEMBER_REQUEST', inviteMember),
]);
