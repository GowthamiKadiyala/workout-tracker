import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
// @ts-ignore
import { LineChart } from "react-native-chart-kit";
// REF: Import Config
import API_URL from "../../config";

export default function DashboardScreen() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [stats, setStats] = useState({
    labels: ["Mon"],
    datasets: [{ data: [0] }],
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const screenWidth = Dimensions.get("window").width || 300;
  const chartWidth = screenWidth > 40 ? screenWidth - 40 : 300;

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        let id;
        if (Platform.OS === "web") {
          // @ts-ignore
          id = localStorage.getItem("userId");
        } else {
          id = await SecureStore.getItemAsync("userId");
        }
        setUserId(id);
        if (id) {
          await Promise.all([
            fetchWorkouts(id),
            fetchStats(id),
            fetchSchedule(id),
          ]);
          setLoading(false);
        }
      };
      loadData();
    }, [])
  );

  const fetchWorkouts = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/workouts/${id}`);
      setWorkouts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStats = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/workouts/stats/${id}`);
      const data = response.data;
      if (data.length > 0) {
        setStats({
          labels: data.map((d: any) => d.date),
          datasets: [{ data: data.map((d: any) => d.volume) }],
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSchedule = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/schedule/${id}`);
      setUpcoming(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // FIX: Real Logout (Deletes Token)
  const handleLogout = async () => {
    if (Platform.OS === "web") {
      // @ts-ignore
      localStorage.removeItem("userToken");
      // @ts-ignore
      localStorage.removeItem("userId");
    } else {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userId");
    }
    // Navigate back to login
    router.replace("/");
  };

  const renderWorkoutItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      {item.exercises.map((ex: any, index: number) => (
        <Text key={index} style={styles.cardText}>
          • {ex.name}: {ex.sets}x{ex.reps} @ {ex.weight}lbs
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard 📊</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#4ADE80" }]}
          onPress={() => router.push("/(tabs)/log")}
        >
          <Text style={styles.btnText}>+ Log</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#A855F7" }]}
          onPress={() => router.push("/schedule")}
        >
          <Text style={styles.btnText}>📅 Plan</Text>
        </TouchableOpacity>
      </View>

      {upcoming.length > 0 && (
        <View style={styles.upcomingContainer}>
          <Text style={styles.sectionTitle}>Up Next ⏳</Text>
          {upcoming.map((item: any) => (
            <View key={item.id} style={styles.scheduleCard}>
              <Text style={styles.scheduleTitle}>{item.title}</Text>
              <Text style={styles.scheduleDate}>
                {new Date(item.date).toDateString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Volume Progress (Lbs)</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={stats}
          width={chartWidth}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" lbs"
          chartConfig={{
            backgroundColor: "#1E1E1E",
            backgroundGradientFrom: "#1E1E1E",
            backgroundGradientTo: "#1E1E1E",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "6", strokeWidth: "2", stroke: "#4ADE80" },
          }}
          bezier
          style={{ borderRadius: 16 }}
        />
      </View>

      <Text style={styles.sectionTitle}>Recent History</Text>
      {loading ? (
        <ActivityIndicator color="#4ADE80" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkoutItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 32, color: "#fff", fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  logoutText: { color: "#FF3B30", fontWeight: "bold" },
  buttonRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#000", fontWeight: "bold", fontSize: 18 },
  sectionTitle: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 10,
    marginTop: 10,
  },
  chartContainer: { alignItems: "center", marginBottom: 20 },
  list: { width: "100%" },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  cardDate: { color: "#888", fontSize: 14 },
  cardText: { color: "#ccc", fontSize: 16, marginBottom: 4 },
  upcomingContainer: { marginBottom: 20 },
  scheduleCard: {
    backgroundColor: "#2D1B4E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scheduleTitle: { color: "#E9D5FF", fontWeight: "bold", fontSize: 16 },
  scheduleDate: { color: "#C084FC", fontSize: 14 },
});
