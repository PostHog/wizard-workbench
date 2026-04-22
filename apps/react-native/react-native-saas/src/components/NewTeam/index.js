import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { Text, TextInput, TouchableOpacity } from 'react-native';

import { createTeamRequest } from '~/store/modules/teams/actions';
import { posthog } from '~/config/posthog';

import Modal from '~/components/Modal';

import styles from './styles';

export default function NewTeam({ visible, onRequestClose }) {
  const dispatch = useDispatch();
  const [newTeam, setNewTeam] = useState('');

  function handleSubmit() {
    dispatch(createTeamRequest(newTeam));
    posthog.capture('team_created', { team_name: newTeam });
    setNewTeam('');
    onRequestClose();
  }

  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <Text style={styles.label}>NAME</Text>
      <TextInput
        style={styles.input}
        autoFocus
        underlineColorAndroid="transparent"
        returnKeyType="send"
        onSubmitEditing={handleSubmit}
        value={newTeam}
        onChangeText={text => setNewTeam(text)}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>CREATE TEAM</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onRequestClose} style={styles.cancel}>
        <Text style={styles.cancelText}>CANCEL</Text>
      </TouchableOpacity>
    </Modal>
  );
}

NewTeam.propTypes = {
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};
