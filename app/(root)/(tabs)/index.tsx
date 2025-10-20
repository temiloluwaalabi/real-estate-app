import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-5">
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row items-center">
            <Image source={images.avatar} className="size-12 rounded-full" />
            <View className="flex flex-col items-start justify-center ml-2">
              <Text className="text-xs font-rubik text-black-100">
                Good Morning
              </Text>
              <Text className="text-base font-rubik-medium text-black-300">
                Temiloluwa
              </Text>
            </View>
          </View>
          <View className="relative">
            <Image source={icons.bell} className="size-6" />
            <View className="absolute top-0 right-1 size-2 rounded-full bg-primary-300" />
          </View>
        </View>
        <Search placeholder="Search for anything" />
        <View className="my-5">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-rubik-bold text-black-300">
              Featured
            </Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300">
                See All
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
