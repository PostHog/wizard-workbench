import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import TeamSwitcher from '../../components/TeamSwitcher';
import Projects from '../../components/Projects';
import Members from '../../components/Members';
import { signOut } from '../../store/modules/auth/actions';
import { trackEvent } from '../../services/posthogTracking';

import styles from './styles';

export default function Main() {
  const dispatch = useDispatch();
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const activeTeam = useSelector(state => state.teams.active);

  return (
    <SafeAreaView style={styles.backgroundWrapper} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            testID="open-team-switcher-button"
            hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }}
            onPress={() => {
              trackEvent('team_switcher_opened', {
                has_active_team: Boolean(activeTeam),
              });
              setLeftOpen(true);
            }}
          >
            <Text style={{ fontSize: 24 }}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.teamTitle}>
            {activeTeam ? activeTeam.name : 'Select a team'}
          </Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TouchableOpacity
              testID="open-members-drawer-button"
              hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }}
              onPress={() => {
                trackEvent('members_drawer_opened', {
                  has_active_team: Boolean(activeTeam),
                });
                setRightOpen(true);
              }}
            >
              <Text style={{ fontSize: 20, color: '#fff' }}>👥</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="sign-out-button"
              hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }}
              onPress={() => dispatch(signOut())}
            >
              <Text style={{ fontSize: 20, color: '#fff' }}>⎋</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Projects />
      </View>

      {/* Left Drawer - Teams */}
      <Modal
        visible={leftOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setLeftOpen(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row' }}
          activeOpacity={1}
          onPress={() => setLeftOpen(false)}
        >
          <View style={[styles.drawerContainer, { width: 250 }]}>
            <TeamSwitcher onClose={() => setLeftOpen(false)} />
          </View>
          <View style={{ flex: 1 }} />
        </TouchableOpacity>
      </Modal>

      {/* Right Drawer - Members */}
      <Modal
        visible={rightOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setRightOpen(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row' }}
          activeOpacity={1}
          onPress={() => setRightOpen(false)}
        >
          <View style={{ flex: 1 }} />
          <View style={[styles.drawerContainer, { width: 300 }]}>
            <Members onClose={() => setRightOpen(false)} />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
