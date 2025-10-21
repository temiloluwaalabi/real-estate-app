import { Property } from "@/types";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import {
  Account,
  Avatars,
  Client,
  Databases,
  OAuthProvider,
  Query,
} from "react-native-appwrite";

export const config = {
  platform: "com.davidleotech.native",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  galleriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);
export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );

    if (!response) {
      throw new Error("Failed to login");
    }

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type !== "success") throw new Error("Failed to login");

    const url = new URL(browserResult.url);

    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) throw new Error("Failed to login");

    const session = await account.createSession(userId, secret);

    if (!session) throw new Error("Failed to create session");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export const getCurrentUser = async () => {
  try {
    const result = await account.get();

    if (result.$id) {
      const userAvatar = avatar.getInitials(result.name);

      return {
        ...result,
        avatar: userAvatar.toString(),
      };
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getLatestProperties = async () => {
  try {
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );

    return result.documents as unknown as Property[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All")
      buildQuery.push(Query.equal("type", filter));

    if (query)
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery
    );

    return result.documents as unknown as Property[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// write function to get property by id
export async function getPropertyById({ id }: { id: string }) {
  try {
    // Fetch the main property document
    const property = await databases.getDocument(
      config.databaseId!,
      config.propertiesCollectionId!,
      id
    );
    // Fetch the agent details if agent ID exists
    if (property.agent) {
      try {
        const agent = await databases.getDocument(
          config.databaseId!,
          config.agentsCollectionId!, // You need to add this to your config
          property.agent
        );
        property.agent = agent;
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    }

    // Fetch gallery images by filtering where property field equals this property's ID
    try {
      const galleryResponse = await databases.listDocuments(
        config.databaseId!,
        config.galleriesCollectionId!,
        [Query.equal("property", id)] // This is the property relationship field in Gallery
      );
      property.gallery = galleryResponse.documents;
    } catch (error) {
      console.error("Error fetching gallery:", error);
      property.gallery = [];
    }

    // Fetch reviews by filtering where property field equals this property's ID
    try {
      const reviewsResponse = await databases.listDocuments(
        config.databaseId!,
        config.reviewsCollectionId!,
        [Query.equal("property", id)] // Check your Reviews collection for the actual field name
      );
      property.reviews = reviewsResponse.documents;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      property.reviews = [];
    }
    // const result = await databases.getDocument(
    //   config.databaseId!,
    //   config.propertiesCollectionId!,
    //   id
    // );
    return property as unknown as Property;
  } catch (error) {
    console.error(error);
    return null;
  }
}
