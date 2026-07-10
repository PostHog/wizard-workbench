import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, TouchableOpacity, Image, Text } from 'react-native';

import { getTeamsRequest, selectTeam } from '~/store/modules/teams/actions';
import { signOut } from '~/store/modules/auth/actions';
import { trackEvent } from '~/services/posthogTracking';

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
            testID={`team-switcher-option-${team.id}`}
            style={styles.teamContainer}
            onPress={() => {
              trackEvent('team_selected', {
                team_id: String(team.id),
                team_slug: team.slug,
                team_name_length: team.name.length,
              });
              dispatch(selectTeam(team));
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
          testID="open-new-team-modal-button"
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
          testID="team-switcher-sign-out-button"
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
