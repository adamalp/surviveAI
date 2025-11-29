import { Redirect } from 'expo-router';

export default function Index() {
  // Route to home tab
  return <Redirect href={'/(tabs)/home' as any} />;
}
