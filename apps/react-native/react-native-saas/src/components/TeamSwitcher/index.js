import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, TouchableOpacity, Image, Text } from 'react-native';

import { getTeamsRequest, selectTeam } from '~/store/modules/teams/actions';
import { signOut } from '~/store/modules/auth/actions';
import { posthog } from '~/config/posthog';

import NewTeam from '~/components/NewTeam';

import styles from './styles';

export default function TeamSwitcher() {
  const dispatch = useDispatch();
  const teams = useSelector(state => state.teams);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getTeamsRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <View>
        {teams.data.map(team => (
          <TouchableOpacity
            key={team.id}
            style={styles.teamContainer}
            onPress={() => {
              dispatch(selectTeam(team));
              posthog.capture('team_selected', { team_id: team.id, team_name: team.name });
            }}
          >
            <Image
              style={styles.teamAvatar}
              source={{
                uri: `https://ui-avatars.com/api/?font-size=0.33&background=7159c1&color=fff&name=${team.name}`,
              }}
            />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.newTeam}
          onPress={() => setIsModalOpen(true)}
        >
          <Text style={{ fontSize: 24, color: '#999' }}>+</Text>
        </TouchableOpacity>

        <NewTeam
          visible={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
        />
      </View>

      <View style={styles.signOutContainer}>
        <TouchableOpacity
          style={styles.signOut}
          onPress={() => {
            dispatch(signOut());
          }}
        >
          <Text style={{ fontSize: 20, color: '#999' }}>⎋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
