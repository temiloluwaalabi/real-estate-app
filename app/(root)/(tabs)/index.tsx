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
    </View>
  );
}
