import { CommonActions, NavigationProp } from '@react-navigation/native';

export function resetToTabsScreen(navigation: Omit<NavigationProp<ReactNavigation.RootParamList>, 'getState'>) {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: '(tabs)' }],
    }),
  );
}
