import AstalPowerProfiles from 'gi://AstalPowerProfiles?version=0.1';
import { QSMenu, QSToggleButton } from './button';
import { createBinding } from 'gnim';
import { fake } from '@/support/utils';
import { Box, FlatButton, Icon } from '@/components';

const power = AstalPowerProfiles.get_default();

const profilesNames = {
  'power-saver': 'Power Saver',
  balanced: 'Balanced',
  performance: 'Performance',
} as Record<string, any>;

export const Power = () => {
  return (
    <QSToggleButton
      name="power"
      icon={createBinding(power, 'activeProfile').as(v => `power-profile-${v}`)}
      state={fake(true)}
      label={createBinding(power, 'activeProfile').as(v => v.charAt(0).toUpperCase() + v.slice(1))}
      activate={() => {}}
      deactivate={() => {}}
    />
  );
};

export const PowerSelection = () => {
  const profiles = power.get_profiles();

  return (
    <QSMenu name="power" icon="power-profile-performance" title="Power Selection">
      <Box vertical>
        {profiles.map(profile => {
          const isActive = createBinding(power, 'active_profile').as(v => v === profile.profile);
          return (
            <FlatButton color={isActive.as(v => (v ? 'success' : 'primary'))} onClicked={() => power.set_active_profile(profile.profile)}>
              <Box px="2xl" m="md">
                <Icon symbolic css="margin-right:.4em;" iconName={`power-profile-${profile.profile}`} />
                <label css="margin-right:.2em;" label={profilesNames[profile.profile]} wrap />
                <Icon symbolic visible={isActive} iconName="object-select" css={isActive.as(s => `opacity: ${s ? 100 : 0};`)} />
              </Box>
            </FlatButton>
          );
        })}
      </Box>
      {/* <Separator my="md" /> */}
      {/* <button onClicked={() => sh(quicksettings.network.peek())}> */}
      {/*   <Box px="2xl" gap="md"> */}
      {/*     <Icon symbolic iconName="applications-system" /> */}
      {/*     <label label="Network" /> */}
      {/*   </Box> */}
      {/* </button> */}
    </QSMenu>
  );
};
