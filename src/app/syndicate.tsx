import { Search, ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabInset, Spacing } from "@/constants/theme";
import { Syndicate, MOCK_SYNDICATES } from "@/constants/syndicate-mock";

const reindeerIcon = require("@/assets/image/assets_images_icons_sanctuary_reindeer.webp");
const phoenixIcon = require("@/assets/image/assets_images_icons_sanctuary_phoenix.webp");
const peacockIcon = require("@/assets/image/assets_images_icons_sanctuary_peacock.webp");
const pandaIcon = require("@/assets/image/assets_images_icons_sanctuary_panda.webp");
const flamingoIcon = require("@/assets/image/assets_images_icons_sanctuary_flamingo.webp");
const alpacaIcon = require("@/assets/image/assets_images_icons_sanctuary_alpaca.webp");

const CLAN_LOGOS = [
  reindeerIcon,
  phoenixIcon,
  peacockIcon,
  pandaIcon,
  flamingoIcon,
  alpacaIcon,
];

const crownIcon = require("@/assets/image/assets_images_icons_misc_crown.webp");
const coinsIcon = require("@/assets/image/assets_images_icons_misc_coins.webp");

export default function SyndicateScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, 20) + 8;

  const [selectedSyndicate, setSelectedSyndicate] = useState<Syndicate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedMessage, setJoinedMessage] = useState<string | null>(null);

  // Creation Form State
  const [isCreating, setIsCreating] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(CLAN_LOGOS[0]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [minLevel, setMinLevel] = useState("1");
  const [minGold, setMinGold] = useState("0");

  const filteredSyndicates = MOCK_SYNDICATES.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // MOCK STATS for requirement checking to match provided logic
  const playerStats = { level: 12, totalAsset: 50 };

  if (selectedSyndicate) {
    const isFull = selectedSyndicate.memberCount >= selectedSyndicate.maxMembers;
    const meetsReqs = playerStats.level >= selectedSyndicate.minLevel && playerStats.totalAsset >= selectedSyndicate.minAsset;
    const canJoin = !isFull && selectedSyndicate.status !== "Closed" && meetsReqs;

    return (
      <View style={[styles.container, { paddingTop: topPadding }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedSyndicate(null)}
          >
            <ChevronLeft color="#032018" size={20} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Profile Header (Avatar Left, Info Right) */}
          <View style={styles.profileHeaderRow}>
            <View style={styles.profileAvatarBox}>
              <Image
                source={
                  selectedSyndicate.name.toLowerCase().includes("phoenix") ||
                  selectedSyndicate.rank % 2 === 0
                    ? peacockIcon
                    : alpacaIcon
                }
                style={styles.profileAvatarImage}
                contentFit="contain"
              />
            </View>

            <View style={styles.profileHeaderRight}>
              <View style={styles.profileRankRow}>
                <Text style={styles.rankText}>Rank #{selectedSyndicate.rank}</Text>
                {/* Top Join Button */}
                {!joinedMessage?.includes(selectedSyndicate.name) && (
                  <TouchableOpacity
                    style={[
                      styles.joinBtnSmall,
                      !canJoin && styles.fullBtn
                    ]}
                    disabled={!canJoin}
                    onPress={() => {
                      setJoinedMessage(`You joined ${selectedSyndicate.name}!`);
                      setSelectedSyndicate(null);
                    }}
                  >
                    <Text style={[
                      styles.joinBtnText,
                      !canJoin && styles.fullBtnText
                    ]}>
                      {isFull ? "Full" : canJoin ? "Join" : "Locked"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Requirements Next to Avatar */}
              <View style={styles.clanReqRowProfile}>
                <View>
                  <Text style={styles.reqLabel}>Min Level</Text>
                  <Text style={styles.reqValueLarge}>{selectedSyndicate.minLevel}</Text>
                </View>
                <View>
                  <Text style={styles.reqLabel}>Min Asset</Text>
                  <Text style={styles.reqValueLarge}>{selectedSyndicate.minAsset}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Clan Name directly under the header block */}
          <Text style={styles.profileNameLarge}>{selectedSyndicate.name}</Text>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.descriptionText}>
              {selectedSyndicate.description}
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsRow}>
            <View style={[styles.card, styles.statCardCentered]}>
              <Text style={styles.reqLabel}>Members</Text>
              <Text style={styles.statValue}>
                {selectedSyndicate.memberCount}/{selectedSyndicate.maxMembers}
              </Text>
            </View>
            <View style={[styles.card, styles.statCardCentered]}>
              <Text style={styles.reqLabel}>Status</Text>
              <Text style={styles.statValue}>{selectedSyndicate.status}</Text>
            </View>
          </View>

          {/* Members List */}
          <View style={{ marginTop: 8 }}>
            <Text style={styles.sectionTitle}>
              Members ({selectedSyndicate.memberCount})
            </Text>
            <View style={styles.membersListCard}>
              {selectedSyndicate.members.map((member, idx) => (
                <View
                  key={member.id}
                  style={[
                    styles.memberRow,
                    idx > 0 && styles.memberRowBorder,
                  ]}
                >
                  <View style={styles.memberInfo}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberInitial}>{member.initial}</Text>
                    </View>
                    <View>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberRole}>{member.role}</Text>
                    </View>
                  </View>
                  <Text style={styles.memberLevel}>Lv.{member.level}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // --- Create Mode View ---
  if (isCreating) {
    const isNameValid = name.trim().length >= 3;
    
    return (
      <View style={[styles.container, { paddingTop: topPadding }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setIsCreating(false)}
          >
            <ChevronLeft color="#032018" size={20} />
            <Text style={styles.backText}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.profileNameLarge}>Create Clan</Text>

          {/* Logo Picker */}
          <View style={styles.card}>
            <Text style={styles.reqLabel}>Clan Logo</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 12, justifyContent: "space-between" }}>
              {CLAN_LOGOS.map((logo, index) => {
                const isSelected = selectedLogo === logo;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedLogo(logo)}
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: isSelected ? "rgba(113, 179, 18, 0.2)" : "#F8F9FA",
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: isSelected ? "#032018" : "transparent"
                    }}
                  >
                    <Image source={logo} style={{ width: 36, height: 36 }} contentFit="contain" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Basis Info */}
          <View style={styles.card}>
            <Text style={styles.reqLabel}>Clan Name (3-28 chars)</Text>
            <TextInput
              style={styles.inputField}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Grain Ghosts"
              placeholderTextColor="rgba(3, 32, 24, 0.4)"
              maxLength={28}
            />

            <Text style={[styles.reqLabel, { marginTop: 16 }]}>
              Description (Optional)
            </Text>
            <TextInput
              style={[
                styles.inputField,
                { height: 80, textAlignVertical: "top" },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your clan..."
              placeholderTextColor="rgba(3, 32, 24, 0.4)"
              multiline
              maxLength={240}
            />
          </View>

          {/* Preferences */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
              <TouchableOpacity
                style={[styles.radioBtn, isPublic && styles.radioBtnActive]}
                onPress={() => setIsPublic(true)}
              >
                <Text
                  style={[styles.radioText, isPublic && styles.radioTextActive]}
                >
                  Public
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioBtn, !isPublic && styles.radioBtnActive]}
                onPress={() => setIsPublic(false)}
              >
                <Text
                  style={[
                    styles.radioText,
                    !isPublic && styles.radioTextActive,
                  ]}
                >
                  Private
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 16 }}>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <Image
                    source={crownIcon}
                    style={{ width: 16, height: 16 }}
                  />
                  <Text style={styles.reqLabel}>Min Level Preference</Text>
                </View>
                <TextInput
                  style={styles.inputField}
                  value={minLevel}
                  onChangeText={setMinLevel}
                  keyboardType="numeric"
                  placeholder="1"
                />
              </View>

              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <Image
                    source={coinsIcon}
                    style={{ width: 16, height: 16 }}
                  />
                  <Text style={styles.reqLabel}>Min Gold Preference</Text>
                </View>
                <TextInput
                  style={styles.inputField}
                  value={minGold}
                  onChangeText={setMinGold}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.createSubmitBtn,
              !isNameValid && { opacity: 0.5 },
            ]}
            disabled={!isNameValid}
            onPress={() => {
              setJoinedMessage(`Created clan: ${name.trim()}`);
              setIsCreating(false);
              setName("");
              setDescription("");
            }}
          >
            <Text style={styles.createSubmitText}>
              Create
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // --- Search List View ---
  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Clans</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => setIsCreating(true)}>
          <Text style={styles.createBtnText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {/* Search Box */}
      <View style={styles.searchBox}>
        <Search size={16} color="rgba(3, 32, 24, 0.5)" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clans..."
          placeholderTextColor="rgba(3, 32, 24, 0.5)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Banner */}
      {joinedMessage && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{joinedMessage}</Text>
        </View>
      )}

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {filteredSyndicates.length === 0 ? (
            <Text style={styles.noClansText}>No clans found</Text>
          ) : (
            filteredSyndicates.map((syn, idx) => {
              const isFull = syn.memberCount >= syn.maxMembers;
              const meetsReqs = playerStats.level >= syn.minLevel && playerStats.totalAsset >= syn.minAsset;
              const canJoin = !isFull && syn.status !== "Closed" && meetsReqs;

              return (
                <TouchableOpacity
                  key={syn.id}
                  style={styles.clanCard}
                  onPress={() => setSelectedSyndicate(syn)}
                  activeOpacity={0.7}
                >
                  <View style={styles.clanAvatar}>
                    <Image
                      source={idx % 2 === 0 ? peacockIcon : alpacaIcon}
                      style={styles.clanAvatarImage}
                      contentFit="contain"
                    />
                  </View>
                  <View style={styles.clanInfo}>
                    <View style={styles.clanNameRow}>
                      <Text style={styles.clanName} numberOfLines={1}>
                        {syn.name}
                      </Text>
                      <Text style={styles.rankText}>Rank #{syn.rank}</Text>
                    </View>
                    <Text style={styles.clanMembersText}>
                      {syn.memberCount}/{syn.maxMembers} members
                    </Text>
                    <View style={styles.clanReqRow}>
                      <Text style={styles.clanReqText}>Lv.{syn.minLevel}+</Text>
                      <Text style={styles.clanReqText}>Asset {syn.minAsset}+</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.joinBtnSmall,
                      !canJoin && styles.fullBtn
                    ]}
                    disabled={!canJoin}
                    onPress={() => setJoinedMessage(`You joined ${syn.name}!`)}
                  >
                    <Text style={[
                      styles.joinBtnText,
                      !canJoin && styles.fullBtnText
                    ]}>
                      {isFull ? "Full" : canJoin ? "Join" : "Locked"}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    // Add significant padding to clear navigation bar and notch completely
    paddingBottom: BottomTabInset + 120,
    gap: Spacing.four,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.four,
  },
  headerTitle: {
    color: "#032018",
    fontSize: 22,
    fontFamily: "Space Mono",
    fontWeight: "700",
  },
  createBtn: {
    backgroundColor: "#032018",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  createBtnText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Space Mono",
    fontWeight: "700",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: Spacing.four,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    marginBottom: Spacing.four,
  },
  searchInput: {
    flex: 1,
    color: "#032018",
    fontSize: 14,
    fontFamily: "Space Mono",
    padding: 0,
  },
  banner: {
    backgroundColor: "white",
    marginHorizontal: Spacing.four,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  bannerText: {
    color: "#032018",
    fontSize: 13,
    fontFamily: "Space Mono",
    fontWeight: "700",
  },
  noClansText: {
    textAlign: "center",
    color: "#032018",
    opacity: 0.5,
    marginTop: 40,
    fontFamily: "Space Mono",
    fontSize: 14,
  },
  listContainer: {
    gap: 12,
  },
  clanCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "flex-start",
  },
  clanAvatar: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(113, 179, 18, 0.15)",
    borderRadius: 14,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  clanAvatarImage: {
    width: 32,
    height: 32,
  },
  clanInfo: {
    flex: 1,
    gap: 2,
  },
  clanNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  clanName: {
    color: "#032018",
    fontSize: 15,
    fontFamily: "Space Mono",
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  rankText: {
    color: "#032018",
    fontSize: 13, // Increased from 11
    fontFamily: "Space Mono",
    opacity: 0.5,
  },
  clanReqRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },
  clanReqText: {
    color: "#032018",
    fontSize: 12, // Increased from 10
    fontFamily: "Space Mono",
    opacity: 0.4,
  },
  clanMembersText: {
    color: "#032018",
    fontSize: 13, // Increased from 11
    fontFamily: "Space Mono",
    opacity: 0.5,
  },
  joinBtnSmall: {
    backgroundColor: "#032018",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 8,
    alignSelf: "center",
  },
  fullBtn: {
    backgroundColor: "#DAF8B7",
  },
  joinBtnText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Space Mono",
    fontWeight: "700",
  },
  fullBtnText: {
    color: "#032018",
  },

  // Profile View Styles
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6, // Very tight
  },
  backText: {
    color: "#032018",
    fontSize: 14,
    fontFamily: "Space Mono",
    marginLeft: 4,
  },
  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6, // Very tight against title
  },
  profileAvatarBox: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatarImage: {
    width: 54,
    height: 54,
  },
  profileHeaderRight: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
    height: 80,
  },
  profileRankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  clanReqRowProfile: {
    flexDirection: "row",
    gap: 24,
  },
  profileNameLarge: {
    color: "#032018",
    fontSize: 26,
    fontFamily: "Space Mono",
    fontWeight: "700",
    marginBottom: 8, // Very tight against description
  },
  sectionTitle: {
    color: "#032018",
    fontSize: 16,
    fontFamily: "Space Mono",
    fontWeight: "700",
    marginBottom: 6, // Very close to list
  },
  reqLabel: {
    color: "#032018",
    fontSize: 13, // Increased from 12
    fontFamily: "Space Mono",
    opacity: 0.5,
  },
  reqValueLarge: {
    color: "#032018",
    fontSize: 20,
    fontFamily: "Space Mono",
    fontWeight: "700",
    marginTop: 2,
  },
  card: {
    backgroundColor: "white",
    padding: 16, // Returned to standard to avoid bloat
    borderRadius: 16,
    marginBottom: 8, // Very tight
  },
  descriptionText: {
    color: "#032018",
    fontSize: 15, // Increased from 14
    fontFamily: "Space Mono",
    opacity: 0.7,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8, // Tight drop before Members
  },
  statCardCentered: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 16, // Smoothed out
    backgroundColor: "white",
    borderRadius: 16,
  },
  statValue: {
    color: "#032018",
    fontSize: 24, // BIGGER
    fontFamily: "Space Mono",
    fontWeight: "700",
  },
  membersListCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
  },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14, // Extra breathing room inside
    paddingHorizontal: 16,
  },
  memberRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "rgba(3, 32, 24, 0.05)",
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  memberAvatar: {
    width: 36, // Bigger
    height: 36, // Bigger
    borderRadius: 18,
    backgroundColor: "#DAF8B7",
    justifyContent: "center",
    alignItems: "center",
  },
  memberInitial: {
    color: "#032018",
    fontSize: 14, // Bigger
    fontFamily: "Space Mono",
    fontWeight: "700",
  },
  memberName: {
    color: "#032018",
    fontSize: 16, // BIGGER
    fontFamily: "Space Mono",
    fontWeight: "700",
    marginBottom: 2,
  },
  memberRole: {
    color: "#032018",
    fontSize: 13, // Increased from 11
    fontFamily: "Space Mono",
    opacity: 0.5,
  },
  memberLevel: {
    color: "#032018",
    fontSize: 14, // Increased from 13
    fontFamily: "Space Mono",
    opacity: 0.6,
  },
  inputField: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(3, 32, 24, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#032018",
    fontFamily: "Space Mono",
    fontSize: 14,
    marginTop: 8,
  },
  radioBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(3, 32, 24, 0.2)",
    alignItems: "center",
  },
  radioBtnActive: {
    backgroundColor: "#032018",
    borderColor: "#032018",
  },
  radioText: {
    color: "#032018",
    fontFamily: "Space Mono",
    fontSize: 14,
    fontWeight: "700",
  },
  radioTextActive: {
    color: "white",
  },
  createSubmitBtn: {
    width: "100%",
    backgroundColor: "#032018", // Dark green
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center", // Centers the text horizontally
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  createSubmitText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Space Mono",
    fontWeight: "700",
  },
});
