import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text className="font-bold text-3xl font-rubik-bold ">
        Welcome to ReState
      </Text>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/explore">Explore</Link>
      <Link href="/profile">Profile</Link>
      <Link
        href={{
          pathname: "/properties/[id]",
          params: { id: "ade-nuga" },
        }}
      >
        Properties Details
      </Link>
    </View>
  );
}
