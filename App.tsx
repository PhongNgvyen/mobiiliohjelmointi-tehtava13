import { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Contact,
  requestPermissionsAsync,
} from "expo-contacts";

type ContactItem = {
  id: string;
  name: string;
  phoneNumber: string;
};

export default function App() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);

  const getContacts = async () => {
    const { status } = await requestPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    const contactList = await Contact.getAll();

    const formattedContacts = await Promise.all(
      contactList.map(async (contact) => {
        const name = await contact.getFullName();
        const phones = await contact.getPhones();

        return {
          id: contact.id,
          name: name ?? "",
          phoneNumber: phones[0]?.number ?? "",
        };
      })
    );

    setContacts(formattedContacts);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            {item.name} {item.phoneNumber}
          </Text>
        )}
      />

      <Button title="GET CONTACTS" onPress={getContacts} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});