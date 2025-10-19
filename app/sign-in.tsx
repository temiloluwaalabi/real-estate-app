import icons from "@/constants/icons";
import images from "@/constants/images";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const handleLogin = async () => {
    console.log("LOGIN");
  };
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />

        <View className="px-10">
          <Text className="text-base text-center font-rubik text-black-200 uppercase">
            Welcome to ReState
          </Text>
          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Let&apos; get you Closer to {" \n"}
            <Text className="text-primary-300">Your Idea Home</Text>
          </Text>
          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            Login to ReState with Google
          </Text>
          <TouchableOpacity
            className="bg-gray-100 shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
            onPress={handleLogin}
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                resizeMode="contain"
                className="size-5"
              />
              <Text className="text-lg font-rubik-medium text-black 300 ml-2">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
