import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { usePostHog } from 'posthog-react-native';

import { View, Text, TouchableOpacity, Switch } from 'react-native';
import api from '~/services/api';
import { captureException } from '~/services/posthog';

import { updateMemberRequest } from '~/store/modules/members/actions';

import Modal from '~/components/Modal';

import styles from './styles';

export default function RoleUpdater({ visible, onRequestClose, member }) {
  const dispatch = useDispatch();
  const posthog = usePostHog();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    async function loadRoles() {
      try {
        const response = await api.get('roles');

        setRoles(response.data);
      } catch (error) {
        captureException(error, {
          area: 'members',
          action: 'load_roles',
        });
      }
    }

    loadRoles();
  }, [dispatch]);

  function handleRoleChange(value, role) {
    if (role.name === 'Administrador' && value === false) return;

    const nextRoles = value
      ? [...member.roles, role]
      : member.roles.filter(memberRole => memberRole.id !== role.id);

    posthog.capture('member_role_update_submitted', {
      member_id: member.id,
      role_count: nextRoles.length,
      changed_role_id: role.id,
      enabled: value,
    });
    dispatch(updateMemberRequest(member.id, nextRoles));
    onRequestClose();
  }

  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View>
        {roles.map(role => (
          <View key={role.id} style={styles.roleContainer}>
            <Text style={styles.roleText}>{role.name}</Text>

            <Switch
              value={
                !!member.roles.find(memberRole => memberRole.id === role.id)
              }
              onValueChange={value => handleRoleChange(value, role)}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={onRequestClose} style={styles.cancel}>
        <Text style={styles.cancelText}>Voltar</Text>
      </TouchableOpacity>
    </Modal>
  );
}

RoleUpdater.propTypes = {
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};
