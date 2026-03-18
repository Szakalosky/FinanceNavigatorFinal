import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Questions = () => {
  const { t } = useTranslation();
  return (
    <View>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowQ1Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowA1Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowQ2Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowA2Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowQ3Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowA3Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowQ4Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowA4Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowQ5Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowA5Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowQ6Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowA6Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowQ7Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowA7Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowQ8Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowA8Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowQ9Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowA9Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowQ10Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowA10Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowQ11Text')}
      </Text>
      <Text style={{ fontSize: 16, color: 'white', margin: 5 }}>
        {t('FAQSettingsWindowA11Text')}
      </Text>
    </View>
  );
};

export default Questions;
