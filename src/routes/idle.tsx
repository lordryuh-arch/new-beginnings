import { createFileRoute, useNavigate } from "@tanstack/react-router";
import rayquazaShinyBg from "@/assets/rayquaza_shiny_bg.png.asset.json";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FlaskConical, Sparkles } from "lucide-react";
import { ItemPixelIcon } from "@/components/ItemPixelIcon";
import type { LucideIcon } from "lucide-react";
import navInicio from "@/assets/icons/nav-inicio.png.asset.json";
import navPokemon from "@/assets/icons/nav-pokemon.png.asset.json";
import navMochila from "@/assets/icons/nav-mochila.png.asset.json";
import navBatalha from "@/assets/icons/nav-batalha.png.asset.json";
import navMelhorias from "@/assets/icons/nav-melhorias.png.asset.json";
import navColecao from "@/assets/icons/nav-colecao.png.asset.json";
import navLoja from "@/assets/icons/nav-loja.png.asset.json";
import navWallet from "@/assets/icons/nav-wallet.png.asset.json";
import navMarket from "@/assets/icons/nav-market.png.asset.json";
import pokemonTabBg from "@/assets/pokemon-tab-bg.jpg";
import iconFragmentCrystal from "@/assets/icon-fragment-crystal.png.asset.json";
import iconWorldGlobe from "@/assets/icon-world-globe-v2.png.asset.json";
import iconCrystalBlue from "@/assets/icon-crystal-blue-diamond.png.asset.json";
import iconCashPackage from "@/assets/icon-cash-package.png.asset.json";
import eventBannerImg from "@/assets/event-banner.png.asset.json";
import trainerAvatarAsset from "@/assets/trainer-avatar.png.asset.json";
import bagBgGlowAsset from "@/assets/bag-bg-dark.jpg.asset.json";
import catAllAsset from "@/assets/cat2-all.png.asset.json";
import catBallsAsset from "@/assets/cat2-balls.png.asset.json";
import catPotionsAsset from "@/assets/cat2-potions.png.asset.json";
import catBooksAsset from "@/assets/cat2-books.png.asset.json";
import catEggsAsset from "@/assets/cat2-eggs.png.asset.json";
import catOtherAsset from "@/assets/cat2-other.png.asset.json";
import { CashShopModal } from "@/components/CashShopModal";
import { BlackMiticEggSprite, BlackMiticEggHud, BlackMiticEggQuickIcon, BLACK_EGG_ITEM_ID, hasReadyEgg } from "@/components/BlackMiticEggPet";
import { grantEmeraldFor } from "@/lib/emerald";

import chestClosedImg from "@/assets/icons/chest-closed.png.asset.json";
import chestOpenImg from "@/assets/icons/chest-open.png.asset.json";
import ballPokeImg from "@/assets/items/icon-pokeball.png.asset.json";
import ballGreatImg from "@/assets/items/icon-greatball.png.asset.json";
import ballUltraImg from "@/assets/items/icon-ultraball.png.asset.json";
import potionNewImg from "@/assets/items/icon-potion.png.asset.json";
import premiumBoxImg from "@/assets/items/icon-premium-box.png.asset.json";
import chestEmeraldImg from "@/assets/chest-emerald.png.asset.json";
import chestAmuletImg from "@/assets/items/icon-chest-amulet.png.asset.json";
import bagIconImg from "@/assets/items/icon-bag.png.asset.json";
import reviveIconImg from "@/assets/items/icon-revive.png.asset.json";
import berryIconImg from "@/assets/items/icon-berry.png.asset.json";
import keyIconImg from "@/assets/items/icon-key.png.asset.json";
import fxSlashImg from "@/assets/items/fx-slash.png.asset.json";
import fxGrassImg from "@/assets/fx/fx-grass.png.asset.json";
import fxFireImg from "@/assets/fx/fx-fire.png.asset.json";
import fxWaterImg from "@/assets/fx/fx-water.png.asset.json";
import fxElectricImg from "@/assets/fx/fx-electric.png.asset.json";
import fxPoisonImg from "@/assets/fx/fx-poison.png.asset.json";
import fxPsychicImg from "@/assets/fx/fx-psychic.png.asset.json";
import fxIceImg from "@/assets/fx/fx-ice.png.asset.json";
import fxRockImg from "@/assets/fx/fx-rock.png.asset.json";
import fxFightingImg from "@/assets/fx/fx-fighting.png.asset.json";
import fxFlyingImg from "@/assets/fx/fx-flying.png.asset.json";
import autoIconImg from "@/assets/items/icon-auto.png.asset.json";
import bookAtkImg from "@/assets/icons/book-atk.png.asset.json";
import bookDefImg from "@/assets/icons/book-def.png.asset.json";
import bookExpImg from "@/assets/icons/book-exp.png.asset.json";
import potionIconAsset from "@/assets/potion-icon.png.asset.json";
import houseLarImg from "@/assets/house-lar.png.asset.json";
import houseLabImg from "@/assets/house-lab.png.asset.json";
import walletHero from "@/assets/wallet-exchange.jpg";
import npcOakSprite from "@/assets/npc-oak.png.asset.json";
import npcAbyssWitch from "@/assets/npc-abyss-witch.png.asset.json";
import continent4Bg from "@/assets/continent4-abyss.jpg";
import npcTraderAsset from "@/assets/npc-trader.png.asset.json";

import { AuthGate, loadIdentity, signOutRubyM, type LocalIdentity } from "@/components/AuthGate";
import overworldPixelAsset from "@/assets/world/overworld.png.asset.json";
import worldMapRefAsset from "@/assets/world_map_reference.png.asset.json";


import { supabase } from "@/integrations/supabase/client";
import { assetUrl, assetUrlFromJson } from "@/lib/assetUrl";
import { loadLatestValid, saveNow } from "@/lib/localSave";
import { loadBattleScene, saveBattleScene, clearBattleScene } from "@/lib/battleScenePersist";
import { useServerSync, type LocalSnapshotForPush } from "@/hooks/useServerSync";
import { fetchCloudSave, getCloudSaveLastError, pushCloudSaveNow, scheduleCloudSync } from "@/lib/cloudSave";
import { fetchTopRanked, recordRankedScore, type RankedRow, submitOddishCaptures, fetchOddishTop, type OddishRankRow } from "@/lib/rankedApi";
import type { PetInstance, Species, Rarity } from "@/game/systems";
import { SPECIES_BASE, makePet, calcMaxHp } from "@/game/systems";
import { computeTeamSynergies, computePower } from "@/game/synergies";
import { rollTraits, TRAITS, TIER_COLOR } from "@/game/traits";
import { TraitIcon } from "@/components/TraitIcon";
import { SynergyPanel } from "@/components/SynergyPanel";
import { PokemonStatsCard } from "@/components/PokemonStatsCard";
import { PokemonMarketPanel } from "@/components/PokemonMarketPanel";
import trainerSheet from "@/assets/trainer.png";
import skinPedroAsset from "@/assets/skins/pedro.webp.asset.json";
import skinPhoneAsset from "@/assets/skins/phone.webp.asset.json";
import skinGokuAsset from "@/assets/skins/goku.webp.asset.json";
import virizionAsset from "@/assets/legends/virizion.gif.asset.json";
import raikouAsset from "@/assets/legends/raikou.gif.asset.json";
import suicuneAsset from "@/assets/legends/suicune.gif.asset.json";
import suicuneShinyAsset from "@/assets/legends/suicune-shiny.gif.asset.json";
import luxrayFAsset from "@/assets/legends/luxray-f.gif.asset.json";

const SKINS: { id: string; label: string; url: string | null }[] = [
  { id: "default", label: "Treinador Clássico", url: null },
  { id: "pedro", label: "Pedro Dancer", url: assetUrlFromJson(skinPedroAsset) },
  { id: "phone", label: "Phone 036", url: assetUrlFromJson(skinPhoneAsset) },
  { id: "goku", label: "Goku", url: assetUrlFromJson(skinGokuAsset) },
];
const SKIN_KEY = "rubym.skin.v1";
import bgmAsset from "@/assets/audio/bgm.mp3.asset.json";
import sfxLevelUpAsset from "@/assets/audio/level-up-new.mp3.asset.json";
import sfxClickAsset from "@/assets/audio/click.mp3.asset.json";
import sfxBonusAsset from "@/assets/audio/bonus.mp3.asset.json";
import sfxChestOpenAsset from "@/assets/audio/chest-open.mp3.asset.json";
import eggTransitusAsset from "@/assets/egg-transitus.mp3.asset.json";

// Sprite constants (mesmo layout do modo Explorar)
const DIR_ROW = { down: 0, left: 1, right: 2, up: 3 } as const;
type Dir = keyof typeof DIR_ROW;

// ============ assets ============
import idleArenaAsset from "@/assets/idle-arena.jpg.asset.json";
import trophyIconAsset from "@/assets/trophy-icon.png.asset.json";
import chestGrassImg from "@/assets/chest-grass.png";
import chestFireImg from "@/assets/chest-fire.png";
import chestWaterImg from "@/assets/chest-water.png";
import chestElectricImg from "@/assets/chest-electric.png";
import chestDarkImg from "@/assets/chest-dark.png";
import chestDragonImg from "@/assets/chest-dragon.png";
const STONE_CHEST: Record<string, string> = {
  stone_grass: chestGrassImg, stone_fire: chestFireImg, stone_water: chestWaterImg,
  stone_electric: chestElectricImg, stone_dark: chestDarkImg, stone_dragon: chestDragonImg,
};
const STONE_PACK_SIZE = 20;
const isStoneId = (id: string) => id.startsWith("stone_") && id !== "stone_pack_all";

import mapSnowAsset from "@/assets/map-snow-valley.png.asset.json";
import mapDesertAsset from "@/assets/map-desert.png.asset.json";
import mapCaveAsset from "@/assets/map-cave1.png.asset.json";
import mapStoneAsset from "@/assets/map-stone.jpg.asset.json";
import mapTerraAsset from "@/assets/map-terra-hornet.jpg.asset.json";
import mapDesertoPurpuraAsset from "@/assets/map-deserto-purpura.jpg.asset.json";
import mapTerryAsset from "@/assets/map-terry.png.asset.json";
import mapN2Asset from "@/assets/map-n2.png.asset.json";
import mapN3Asset from "@/assets/map-n3.png.asset.json";
import mapGelius1Asset from "@/assets/map-gelius-1.png.asset.json";
import mapGelius2Asset from "@/assets/map-gelius-2.png.asset.json";
import eventPenguinAsset from "@/assets/event-penguin-badge.png.asset.json";
import { currentGeliusInfo, isGeliusActive, getGeliusEntries, canEnterGelius, consumeGeliusEntry, GELIUS_CAPTURABLE, GELIUS_PHASE1_POOL, GELIUS_PHASE2_POOL } from "@/game/geliusEvent";
import hornetCocoonAsset from "@/assets/hornet-cocoon.png.asset.json";
import fireLakeAsset from "@/assets/fire-lake.png.asset.json";
import mapVenofogoOrangeAsset from "@/assets/map-lava-valley.jpg.asset.json";
import mapPantanoFogoAsset from "@/assets/map-pantano-fogo.png.asset.json";
import worldMapGlobeAsset from "@/assets/world-map-globe.jpg.asset.json";
import worldMapContinent2Asset from "@/assets/world-map-continent2.jpg.asset.json";
import mapFantasmaAsset from "@/assets/map-fantasma.jpg.asset.json";
import mapCadeiaAbAsset from "@/assets/map-cadeia-ab.png.asset.json";
import mapCadeiaAb1Asset from "@/assets/map-cadeia-ab1.png.asset.json";
import mapCadeiaF1Asset from "@/assets/map-cadeia-f1.png.asset.json";
import mapMythshinyEventAsset from "@/assets/map-mythshiny-event.png.asset.json";
import mapOddish1Asset from "@/assets/map-oddish-1.png.asset.json";
import mapGrassOddish2Asset from "@/assets/grass-oddish-2.png.asset.json";
import mapGrassOddish3Asset from "@/assets/grass-oddish-3.png.asset.json";
import mapOddish2Asset from "@/assets/map-oddish-2.png.asset.json";
import mapOddish3Url from "@/assets/map-oddish3.png";
import absolStartMapAsset from "@/assets/absol-start-map.png.asset.json";
import governanteHallMapAsset from "@/assets/governante-hall-map.png.asset.json";
import continent3Map1Asset from "@/assets/maps/map-continent3-1.png.asset.json";
import continent3Map2Asset from "@/assets/maps/map-continent3-2.png.asset.json";
import npcGovernanteAsset from "@/assets/npc-governante.png.asset.json";
import safiraVerdeAsset from "@/assets/icon-safira-verde.png.asset.json";
import oddishEventGifAsset from "@/assets/oddish-event.gif.asset.json";
import oddishShinyGifAsset from "@/assets/oddish-shiny.gif.asset.json";
import lickitungGifAsset from "@/assets/lickitung.gif.asset.json";
import lickitungShinyGifAsset from "@/assets/lickitung-shiny.gif.asset.json";
import mewtwoEventGifAsset from "@/assets/mewtwo-event.gif.asset.json";
import iceBallIconAsset from "@/assets/ice-pokeball-icon.png.asset.json";
import scrollTeleportAsset from "@/assets/scroll-teleport.png.asset.json";
import { ODDISH_EVENT, oddishEventStatus, oddishMapForCycle, ODDISH_EVENT_POOL, SAFIRA_VERDE_BY_RARITY, MEWTWO_EVENT_CHANCE, MEWTWO_MIN_BALLS, fmtMs as fmtOddishMs } from "@/game/oddishEvent";
// Novos mapas endgame Lv 200→500 (10 mapas, reutilizando bgs no mesmo padrão dos existentes)
import mapForestAsset from "@/assets/map-forest.png.asset.json";
import mapFlorestaSecretaAsset from "@/assets/map-floresta-secreta.png.asset.json";
import mapPedreiraCavernaAsset from "@/assets/map-pedreira-caverna.jpg.asset.json";
import mapRoute3Asset from "@/assets/map-route3.png.asset.json";
import mapForestCaveAsset from "@/assets/map-forest-cave.png.asset.json";
import mapPalletRouteAsset from "@/assets/map-pallet-route.png.asset.json";
import mapEliteRouteAsset from "@/assets/map-elite-route.png.asset.json";
import mapVictoryRoadAsset from "@/assets/map-victoryroad.png.asset.json";
import mapViridianAsset from "@/assets/map-viridian.png.asset.json";
import mapVenenoAsset from "@/assets/map-veneno.png.asset.json";
// Orbs de XP (sprites geradas) — item exclusivo (1 ativo), 1h de +XP
import orbXpMinorAsset from "@/assets/orb-xp-minor.png.asset.json";
import orbXpMajorAsset from "@/assets/orb-xp-major.png.asset.json";
import orbXpSupremeAsset from "@/assets/orb-xp-supreme.png.asset.json";
import orbXpTeamAsset from "@/assets/orb-xp-team.png.asset.json";
import orbIncubatorImg from "@/assets/orb-incubator.png";
import redLakeAsset from "@/assets/red-lake.png.asset.json";
import volcanoAsset from "@/assets/volcano.png.asset.json";
import mapBeachUrl from "@/assets/map-beach-idle.png";
import collectIconImg from "@/assets/icons/collect-icon.png";
import rubyGemAsset from "@/assets/ruby-gem.png.asset.json";
import crystalRedAsset from "@/assets/items/icon-crystal-red.png.asset.json";
const crystalRedImg = assetUrlFromJson(crystalRedAsset);
const crystalGreenImg = assetUrlFromJson(iconCrystalBlue);
import treeOakAsset from "@/assets/tree-oak.png.asset.json";
import treePineAsset from "@/assets/tree-pine.png.asset.json";
import rockBoulderAsset from "@/assets/rock-boulder.png.asset.json";
import bushBerryAsset from "@/assets/bush-berry.png.asset.json";
import rockLavaAsset from "@/assets/rock-lava.png.asset.json";
import caveFloorAsset from "@/assets/cave-floor.jpg.asset.json";
import stalagmiteAsset from "@/assets/stalagmite.png.asset.json";
import caveCrystalAsset from "@/assets/cave-crystal.png.asset.json";

import crystalClusterAsset from "@/assets/crystal-cluster.png.asset.json";
const caveFloorUrl = assetUrlFromJson(caveFloorAsset);
const stalagmiteUrl = assetUrlFromJson(stalagmiteAsset);
const caveCrystalUrl = assetUrlFromJson(caveCrystalAsset);

const crystalClusterUrl = assetUrlFromJson(crystalClusterAsset);

// Pokemon GIFs (reusa os que já existem no projeto)
import charizardGif from "@/assets/charizard.gif";
import pikachuGif from "@/assets/pikachu.gif";
import dragoniteGif from "@/assets/dragonite.gif";
import bulbasaurGif from "@/assets/bulbasaur.gif";
import charmanderGif from "@/assets/charmander.gif";
import squirtleGif from "@/assets/squirtle.gif";
import rattataFAsset from "@/assets/rattata-f.gif.asset.json";
import pidgeyGif from "@/assets/pidgey.gif";
import beedrillGif from "@/assets/beedrill.gif";
import butterfreeGif from "@/assets/butterfree.gif";
import pinsirGif from "@/assets/pinsir.gif";
import golemGif from "@/assets/golem.gif";
import jolteonIdleAsset from "@/assets/jolteon.gif.asset.json";
import laprasIdleAsset from "@/assets/lapras.gif.asset.json";
import blazikenIdleAsset from "@/assets/blaziken.gif.asset.json";
const jolteonGif = assetUrlFromJson(jolteonIdleAsset);
const laprasGif = assetUrlFromJson(laprasIdleAsset);
const blazikenGif = assetUrlFromJson(blazikenIdleAsset);
import zubatAsset from "@/assets/zubat.gif.asset.json";
import ekansAsset from "@/assets/ekans.gif.asset.json";
import machopAsset from "@/assets/machop.gif.asset.json";
import diglettAsset from "@/assets/diglett.gif.asset.json";
import meowthAsset from "@/assets/meowth.gif.asset.json";
import psyduckAsset from "@/assets/psyduck.gif.asset.json";
import lucarioAuraAsset from "@/assets/lucario-aura.webp.asset.json";
import mewAuraAsset from "@/assets/mew-aura.webp.asset.json";
import rioluAsset from "@/assets/riolu.gif.asset.json";
import raichuAsset from "@/assets/raichu.gif.asset.json";
import rayquazaAsset from "@/assets/rayquaza.gif.asset.json";
import oddishAsset from "@/assets/oddish.gif.asset.json";
import bellsproutAsset from "@/assets/bellsprout.gif.asset.json";
import weedleAsset from "@/assets/weedle.gif.asset.json";
import kakunaAsset from "@/assets/kakuna.gif.asset.json";
import parasAsset from "@/assets/paras.gif.asset.json";
import parasectAsset from "@/assets/parasect.gif.asset.json";
import venonatAsset from "@/assets/venonat.gif.asset.json";
import clefairyAsset from "@/assets/clefairy.gif.asset.json";
import sandshrewAsset from "@/assets/sandshrew.gif.asset.json";
import mankeyAsset from "@/assets/mankey.gif.asset.json";
import poliwagAsset from "@/assets/poliwag.gif.asset.json";
import growlitheAsset from "@/assets/growlithe.gif.asset.json";
import abraAsset from "@/assets/abra.gif.asset.json";
import cuboneAsset from "@/assets/cubone.gif.asset.json";
import magnemiteAsset from "@/assets/magnemite.gif.asset.json";
import nidoranFAsset from "@/assets/nidoran-f.gif.asset.json";
import snorlaxAsset from "@/assets/snorlax.gif.asset.json";
import gloomAsset from "@/assets/gloom.gif.asset.json";
import caterpieGif from "@/assets/caterpie.gif";
import metapodGif from "@/assets/metapod.gif";
import vulpixGif from "@/assets/vulpix.gif";
import pidgeottoAsset from "@/assets/pidgeotto.gif.asset.json";
import raticateFAsset from "@/assets/raticate-f.gif.asset.json";
import fearowAsset from "@/assets/fearow.gif.asset.json";
import blastoiseAsset from "@/assets/blastoise.gif.asset.json";
import blastoiseShinyAsset from "@/assets/blastoise-shiny.gif.asset.json";
import deoxysAsset from "@/assets/deoxys-normal.gif.asset.json";
import groudonAsset from "@/assets/groudon.gif.asset.json";
import laprasShinyAsset from "@/assets/lapras-shiny.gif.asset.json";
import charizardShinyAsset from "@/assets/charizard-shiny.gif.asset.json";
import snorlaxMythicAsset from "@/assets/snorlax-mythic.gif.asset.json";
import darkraiAsset from "@/assets/darkrai.gif.asset.json";
import hoOhAsset from "@/assets/ho-oh.gif.asset.json";
import magmortarAsset from "@/assets/magmortar.gif.asset.json";
const pidgeottoUrl = assetUrlFromJson(pidgeottoAsset);
const raticateFUrl = assetUrlFromJson(raticateFAsset);
const fearowUrl = assetUrlFromJson(fearowAsset);
const blastoiseUrl = assetUrlFromJson(blastoiseAsset);
const blastoiseShinyUrl = assetUrlFromJson(blastoiseShinyAsset);
const deoxysUrl = assetUrlFromJson(deoxysAsset);
const groudonUrl = assetUrlFromJson(groudonAsset);
const laprasShinyUrl = assetUrlFromJson(laprasShinyAsset);
const charizardShinyUrl = assetUrlFromJson(charizardShinyAsset);
const snorlaxMythicUrl = assetUrlFromJson(snorlaxMythicAsset);
const darkraiUrl = assetUrlFromJson(darkraiAsset);
const hoOhUrl = assetUrlFromJson(hoOhAsset);
const magmortarUrl = assetUrlFromJson(magmortarAsset);
import lugiaAsset from "@/assets/lugia.gif.asset.json";
import hariyamaAsset from "@/assets/hariyama.gif.asset.json";
import ursaringAsset from "@/assets/ursaring.gif.asset.json";
import moltresAsset from "@/assets/moltres.gif.asset.json";
import zapdosAsset from "@/assets/zapdos.gif.asset.json";
import articunoAsset from "@/assets/articuno.gif.asset.json";
import dittoAsset from "@/assets/ditto.gif.asset.json";
import electabuzzAsset from "@/assets/electabuzz.gif.asset.json";
import gengarAsset from "@/assets/gengar.gif.asset.json";
import hitmontopAsset from "@/assets/hitmontop.gif.asset.json";
import magnetonAsset from "@/assets/magneton.gif.asset.json";
import dittoShinyAsset from "@/assets/ditto-shiny.gif.asset.json";
import scizorAsset from "@/assets/scizor.gif.asset.json";
import umbreonAsset from "@/assets/umbreon.gif.asset.json";
import infernapeAsset from "@/assets/infernape.gif.asset.json";
import krookodileAsset from "@/assets/krookodile.gif.asset.json";
import tyranitarAsset from "@/assets/tyranitar.gif.asset.json";
import nidokingShinyAsset from "@/assets/nidoking-shiny.gif.asset.json";
import dialgaAsset from "@/assets/dialga.gif.asset.json";
import rapidashAsset from "@/assets/rapidash.gif.asset.json";
import rapidashShinyAsset from "@/assets/rapidash-shiny.gif.asset.json";
import skarmoryAsset from "@/assets/skarmory.gif.asset.json";
const lugiaUrl = assetUrlFromJson(lugiaAsset);
const hariyamaUrl = assetUrlFromJson(hariyamaAsset);
const ursaringUrl = assetUrlFromJson(ursaringAsset);
const dittoUrl = assetUrlFromJson(dittoAsset);
const electabuzzUrl = assetUrlFromJson(electabuzzAsset);
const gengarUrl = assetUrlFromJson(gengarAsset);
const hitmontopUrl = assetUrlFromJson(hitmontopAsset);
const magnetonUrl = assetUrlFromJson(magnetonAsset);
const dittoShinyUrl = assetUrlFromJson(dittoShinyAsset);
const scizorUrl = assetUrlFromJson(scizorAsset);
const umbreonUrl = assetUrlFromJson(umbreonAsset);
const infernapeUrl = assetUrlFromJson(infernapeAsset);
const krookodileUrl = assetUrlFromJson(krookodileAsset);
const tyranitarUrl = assetUrlFromJson(tyranitarAsset);
const nidokingShinyUrl = assetUrlFromJson(nidokingShinyAsset);
const dialgaUrl = assetUrlFromJson(dialgaAsset);
const rapidashUrl = assetUrlFromJson(rapidashAsset);
const rapidashShinyUrl = assetUrlFromJson(rapidashShinyAsset);
const skarmoryUrl = assetUrlFromJson(skarmoryAsset);
const moltresUrl = assetUrlFromJson(moltresAsset);
const zapdosUrl = assetUrlFromJson(zapdosAsset);
const articunoUrl = assetUrlFromJson(articunoAsset);
// ═══ MTC — Míticos Brilhantes ═══
import abomasnowGif from "@/assets/abomasnow.gif";
import cloysterGif from "@/assets/cloyster.gif";
import cloysterShinyGif from "@/assets/cloyster-shiny.gif";
import exeggutorGif from "@/assets/exeggutor.gif";
import exeggutorShinyGif from "@/assets/exeggutor-shiny.gif";
import feraligatrGif from "@/assets/feraligatr.gif";
import heracrossGif from "@/assets/heracross.gif";
import heracrossShinyGif from "@/assets/heracross-shiny.gif";
import hitmonchanShinyGif from "@/assets/hitmonchan-shiny.gif";
import kangaskhanGif from "@/assets/kangaskhan.gif";
import meganiumGif from "@/assets/meganium.gif";
import meganiumShinyGif from "@/assets/meganium-shiny.gif";
import moltresShinyGif from "@/assets/moltres-shiny.gif";
import onixShinyGif from "@/assets/onix-shiny.gif";




const IDLE_KEY = "rubym.idle.v1";
const CLOUD_PRELOADED_KEY = "rubym.cloud.preloaded.v1";
const MP_SESSION_KEY = "rubym.multiplayer.session.v1";
const OFFLINE_CAP_MS = 8 * 60 * 60 * 1000;
const idleArenaUrl = assetUrlFromJson(idleArenaAsset);
const mapSnowUrl = assetUrlFromJson(mapSnowAsset);
const mapDesertUrl = assetUrlFromJson(mapDesertAsset);
const mapCaveUrl = assetUrlFromJson(mapCaveAsset);
const mapStoneUrl = assetUrlFromJson(mapStoneAsset);
const mapTerraUrl = assetUrlFromJson(mapTerraAsset);
const mapDesertoPurpuraUrl = assetUrlFromJson(mapDesertoPurpuraAsset);
const mapTerryUrl = assetUrlFromJson(mapTerryAsset);
const mapN2Url = assetUrlFromJson(mapN2Asset);
const mapN3Url = assetUrlFromJson(mapN3Asset);
const hornetCocoonUrl = assetUrlFromJson(hornetCocoonAsset);
const fireLakeUrl = assetUrlFromJson(fireLakeAsset);
const mapVenofogoOrangeUrl = assetUrlFromJson(mapVenofogoOrangeAsset);
const mapPantanoFogoUrl = assetUrlFromJson(mapPantanoFogoAsset);
const mapFantasmaUrl = assetUrlFromJson(mapFantasmaAsset);
const mapCadeiaAbUrl = assetUrlFromJson(mapCadeiaAbAsset);
const mapCadeiaAb1Url = assetUrlFromJson(mapCadeiaAb1Asset);
const mapCadeiaF1Url = assetUrlFromJson(mapCadeiaF1Asset);
const mapMythshinyEventUrl = assetUrlFromJson(mapMythshinyEventAsset);
const iceBallIconUrl = assetUrlFromJson(iceBallIconAsset);
const scrollTeleportUrl = assetUrlFromJson(scrollTeleportAsset);
// URLs dos 10 novos mapas endgame
const mapForestUrl = assetUrlFromJson(mapForestAsset);
const mapFlorestaSecretaUrl = assetUrlFromJson(mapFlorestaSecretaAsset);
const mapPedreiraCavernaUrl = assetUrlFromJson(mapPedreiraCavernaAsset);
const mapRoute3Url = assetUrlFromJson(mapRoute3Asset);
const mapForestCaveUrl = assetUrlFromJson(mapForestCaveAsset);
const mapPalletRouteUrl = assetUrlFromJson(mapPalletRouteAsset);
const mapEliteRouteUrl = assetUrlFromJson(mapEliteRouteAsset);
const mapVictoryRoadUrl = assetUrlFromJson(mapVictoryRoadAsset);
const mapViridianUrl = assetUrlFromJson(mapViridianAsset);
const mapVenenoUrl = assetUrlFromJson(mapVenenoAsset);
const bagBgGlowUrl = assetUrlFromJson(bagBgGlowAsset);
const catAllUrl = assetUrlFromJson(catAllAsset);
const catBallsUrl = assetUrlFromJson(catBallsAsset);
const catPotionsUrl = assetUrlFromJson(catPotionsAsset);
const catBooksUrl = assetUrlFromJson(catBooksAsset);
const catEggsUrl = assetUrlFromJson(catEggsAsset);
const catOtherUrl = assetUrlFromJson(catOtherAsset);
// URLs dos orbs (sprites transparentes)
const orbXpMinorUrl = assetUrlFromJson(orbXpMinorAsset);
const orbXpMajorUrl = assetUrlFromJson(orbXpMajorAsset);
const orbXpSupremeUrl = assetUrlFromJson(orbXpSupremeAsset);
const orbXpTeamUrl = assetUrlFromJson(orbXpTeamAsset);
// Ícones "de buff" bonitos (HUD do treinador) — orb XP, incenso e orb de time
const buffOrbXpUrl = (new URL("../assets/buff-orb-xp.png", import.meta.url)).href;
const buffIncenseHoneyUrl = (new URL("../assets/buff-incense-honey.png", import.meta.url)).href;
const buffTeamOrbUrl = (new URL("../assets/buff-team-orb.png", import.meta.url)).href;
const npcTraderUrl = assetUrlFromJson(npcTraderAsset);
const redLakeUrl = assetUrlFromJson(redLakeAsset);
const volcanoUrl = assetUrlFromJson(volcanoAsset);
const rubyGemUrl = assetUrlFromJson(rubyGemAsset);
const treeOakUrl = assetUrlFromJson(treeOakAsset);
const treePineUrl = assetUrlFromJson(treePineAsset);
const rockBoulderUrl = assetUrlFromJson(rockBoulderAsset);
const bushBerryUrl = assetUrlFromJson(bushBerryAsset);
const rockLavaUrl = assetUrlFromJson(rockLavaAsset);
const rattataFUrl = assetUrlFromJson(rattataFAsset);
const zubatUrl = assetUrlFromJson(zubatAsset);
const ekansUrl = assetUrlFromJson(ekansAsset);
const machopUrl = assetUrlFromJson(machopAsset);
const diglettUrl = assetUrlFromJson(diglettAsset);
const meowthUrl = assetUrlFromJson(meowthAsset);
const psyduckUrl = assetUrlFromJson(psyduckAsset);
const lucarioAuraUrl = assetUrlFromJson(lucarioAuraAsset);
const mewAuraUrl = assetUrlFromJson(mewAuraAsset);
const rioluUrl = assetUrlFromJson(rioluAsset);
const raichuUrl = assetUrlFromJson(raichuAsset);
const rayquazaUrl = assetUrlFromJson(rayquazaAsset);
const oddishUrl = assetUrlFromJson(oddishAsset);
const bellsproutUrl = assetUrlFromJson(bellsproutAsset);
const weedleUrl = assetUrlFromJson(weedleAsset);
const kakunaUrl = assetUrlFromJson(kakunaAsset);
const parasUrl = assetUrlFromJson(parasAsset);
const parasectUrl = assetUrlFromJson(parasectAsset);
const venonatUrl = assetUrlFromJson(venonatAsset);
const clefairyUrl = assetUrlFromJson(clefairyAsset);
const sandshrewUrl = assetUrlFromJson(sandshrewAsset);
const mankeyUrl = assetUrlFromJson(mankeyAsset);
const poliwagUrl = assetUrlFromJson(poliwagAsset);
const growlitheUrl = assetUrlFromJson(growlitheAsset);
const abraUrl = assetUrlFromJson(abraAsset);
const cuboneUrl = assetUrlFromJson(cuboneAsset);
const magnemiteUrl = assetUrlFromJson(magnemiteAsset);
const nidoranFUrl = assetUrlFromJson(nidoranFAsset);
const snorlaxUrl = assetUrlFromJson(snorlaxAsset);
const gloomUrl = assetUrlFromJson(gloomAsset);
const npcGovernanteUrl = assetUrlFromJson(npcGovernanteAsset);
const worldMapContinent2Url = assetUrlFromJson(worldMapContinent2Asset);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gameDb = supabase as any;

const potionIconUrl = assetUrlFromJson(potionIconAsset);
const bgmUrl = assetUrlFromJson(bgmAsset);
const sfxLevelUpUrl = assetUrlFromJson(sfxLevelUpAsset);
const sfxClickUrl = assetUrlFromJson(sfxClickAsset);
const sfxBonusUrl = assetUrlFromJson(sfxBonusAsset);
const sfxChestOpenUrl = assetUrlFromJson(sfxChestOpenAsset);

type IdleMapId =
  | "arena" | "terra" | "deserto_purpura" | "terry" | "n2" | "n3" | "pantano_fogo" | "venofogo" | "praia" | "neve" | "deserto" | "caverna" | "fantasma"
  | "gelius1" | "gelius2"
  // Cadeia endgame — 3 bases (Vale das Rochas, Vulcão Ativo, Núcleo) + 4 recolores
  | "vale_rochas" | "vale_planta" | "vale_gelo" | "vale_veneno" | "vale_fogo"
  | "vulcao_ativo" | "nucleo_primordial"
  // Cadeia Abissal — 5 mapas 1000-3000, recolores do Pântano em Chamas
  | "abismo_gelo" | "abismo_veneno" | "abismo_raio" | "abismo_sombra" | "abismo_dragao"
  // Cadeia estendida — Lv 3000 até 6000, continuação natural do Abismo do Dragão
  | "cadeia_ab" | "cadeia_ab1" | "cadeia_f1"
  // Evento Mítico Shiny — abre 5min a cada 1h
  | "evento_myth"
  // Evento Oddish Odyssey — 24h aberto, 3 mapas conectados por portal
  | "oddish_o1" | "oddish_o2" | "oddish_o3"
  // Evento Grass Oddish — mapa exclusivo, entrada custa 20 Stone Verdejante
  | "grass_oddish"
  // Continente do Governante — acesso via Carta do Governante
  | "absol_start" | "governante_hall"
  // Terceiro Continente — Bônus
  | "continent3_map1" | "continent3_map2";
// overlay: cor de recolorização aplicada por cima do bg (mix-blend: color)
// stars: dificuldade (1-8) exibida na UI
type IdleMapDef = {
  name: string; diff: string; bg: string; rate: number; minLevel: number; maxLevel?: number;
  element: string; stars?: number; overlay?: string;
  cycle?: { cycleMs: number; openMs: number };
  entryCrystals?: number;
  /** Mapa de RAID: níveis exibidos não indicam progressão de treinador, e sim faixa dos chefes/encontros. */
  raid?: boolean;
};
const IDLE_MAPS: Record<IdleMapId, IdleMapDef> = {
  arena:    { name: "Vale Verdejante",         diff: "Fácil",     bg: idleArenaUrl,    rate: 1.0, minLevel: 1,  maxLevel: 30, element: "Grama", stars: 1 },
  terra:    { name: "Ninho de Marimbondo",     diff: "Fácil+",    bg: mapTerraUrl,     rate: 1.2, minLevel: 10, maxLevel: 35, element: "Terra", stars: 1 },
  deserto_purpura: { name: "Areias de Anúbis", diff: "Médio",     bg: mapDesertoPurpuraUrl, rate: 1.8, minLevel: 20, maxLevel: 55, element: "Terra/Veneno", stars: 2, entryCrystals: 5 },
  terry:    { name: "Terras de Terry",         diff: "Elite",     bg: mapTerryUrl,     rate: 3.2, minLevel: 200, maxLevel: 400, element: "Terra", stars: 4, entryCrystals: 8 },
  n2:       { name: "Planície de Terry",        diff: "Elite+",    bg: mapN2Url,        rate: 3.8, minLevel: 350, maxLevel: 550, element: "Terra", stars: 5, entryCrystals: 20 },
  n3:       { name: "Confins de Terry",         diff: "Lendário",  bg: mapN3Url,        rate: 4.5, minLevel: 500, maxLevel: 700, element: "Terra", stars: 5, entryCrystals: 20 },
  pantano_fogo: { name: "Pântano em Chamas",   diff: "PRIMORDIAL",bg: mapPantanoFogoUrl,rate: 12.0, minLevel: 700, maxLevel: 1200, element: "Fogo/Veneno", stars: 8, entryCrystals: 400 },
  // ═══ CADEIA ABISSAL — Lv 1000 a 3000 (5 mapas recolorizados do Pântano) ═══
  abismo_gelo:   { name: "Abismo Gélido",      diff: "ABISSAL",   bg: mapPantanoFogoUrl, rate: 14.0, minLevel: 1000, maxLevel: 1500, element: "Gelo",     stars: 8, entryCrystals: 800,  overlay: "rgba(120,200,255,0.55)" },
  abismo_veneno: { name: "Abismo Tóxico",      diff: "ABISSAL+",  bg: mapPantanoFogoUrl, rate: 16.0, minLevel: 1400, maxLevel: 2000, element: "Veneno",   stars: 9, entryCrystals: 1200, overlay: "rgba(170,80,220,0.55)" },
  abismo_raio:   { name: "Abismo do Trovão",   diff: "APOCALIP.", bg: mapPantanoFogoUrl, rate: 18.0, minLevel: 1800, maxLevel: 2400, element: "Elétrico", stars: 9, entryCrystals: 1600, overlay: "rgba(255,220,80,0.50)" },
  abismo_sombra: { name: "Abismo Sombrio",     diff: "APOCALIP.", bg: mapPantanoFogoUrl, rate: 20.0, minLevel: 2200, maxLevel: 2700, element: "Sombra",   stars: 10, entryCrystals: 2200, overlay: "rgba(40,20,60,0.65)" },
  abismo_dragao: { name: "Abismo do Dragão",   diff: "ABSOLUTO",  bg: mapPantanoFogoUrl, rate: 22.0, minLevel: 2500, maxLevel: 3000, element: "Dragão",   stars: 10, entryCrystals: 3000, overlay: "rgba(255,150,40,0.55)" },
  // ═══ CADEIA ESTENDIDA — continuação após Abismo do Dragão (3000→6000) ═══
  cadeia_ab:  { name: "Fenda Estelar",          diff: "TRANSC.",   bg: mapCadeiaAbUrl,  rate: 26.0, minLevel: 3000, maxLevel: 3500, element: "Estelar", stars: 10, entryCrystals: 4000 },
  cadeia_ab1: { name: "Cripta Etérea",          diff: "TRANSC.+",  bg: mapCadeiaAb1Url, rate: 30.0, minLevel: 3500, maxLevel: 5000, element: "Etéreo",  stars: 10, entryCrystals: 6000 },
  cadeia_f1:  { name: "Chamas do Fim",          diff: "COSMICO",   bg: mapCadeiaF1Url,  rate: 34.0, minLevel: 4000, maxLevel: 6000, element: "Fogo/Cosmico", stars: 10, entryCrystals: 8000 },
  // ═══ EVENTO MÍTICO SHINY — abre 5min a cada 1h ═══
  evento_myth: { name: "Domínio Mítico Shiny",  diff: "EVENTO",    bg: mapMythshinyEventUrl, rate: 40.0, minLevel: 1, maxLevel: 9999, element: "Todos", stars: 10 },
  praia:    { name: "Praia Coral",             diff: "Fácil+",    bg: mapBeachUrl,     rate: 1.3, minLevel: 15, maxLevel: 40, element: "Água", stars: 1 },
  venofogo: { name: "Pântano Ardente",         diff: "Difícil",   bg: mapVenofogoOrangeUrl, rate: 1.8, minLevel: 25, maxLevel: 120, element: "Veneno/Fogo", stars: 2 },

  neve:     { name: "Vale Verdejante de Neve", diff: "Médio",     bg: mapSnowUrl,      rate: 1.6, minLevel: 40, maxLevel: 65, element: "Gelo", stars: 2 },
  deserto:  { name: "Deserto Escaldante",      diff: "Médio+",    bg: mapDesertUrl,    rate: 2.0, minLevel: 50, maxLevel: 75, element: "Fogo", stars: 2 },
  caverna:  { name: "Caverna Rochosa",         diff: "Extremo",   bg: mapCaveUrl,      rate: 3.5, minLevel: 60, maxLevel: 90, element: "Pedra", stars: 3,
              cycle: { cycleMs: 2.5 * 60 * 60 * 1000, openMs: 30 * 60 * 1000 } },
  fantasma: { name: "Cemitério Assombrado",    diff: "RAID",      bg: mapFantasmaUrl,  rate: 4.0, minLevel: 1,  maxLevel: 9999, element: "Fantasma", stars: 4, raid: true },
  // ═══ ENDGAME — cadeia progressiva, portal visível mas exige nível de treinador ═══
  vale_rochas:       { name: "Vale das Rochas",   diff: "Lendário",   bg: mapPedreiraCavernaUrl, rate: 6.0, minLevel: 50,  maxLevel: 150, element: "Pedra",  stars: 4 },
  vale_planta:       { name: "Vale Esmeralda",    diff: "Lendário+",  bg: mapPedreiraCavernaUrl, rate: 6.5, minLevel: 120, maxLevel: 220, element: "Planta", stars: 5, overlay: "rgba(70,210,90,0.42)" },
  vale_gelo:         { name: "Vale Gélido",       diff: "Mítico",     bg: mapPedreiraCavernaUrl, rate: 7.0, minLevel: 190, maxLevel: 290, element: "Gelo",   stars: 6, overlay: "rgba(140,220,255,0.45)" },
  vale_veneno:       { name: "Vale Tóxico",       diff: "Mítico+",    bg: mapPedreiraCavernaUrl, rate: 7.5, minLevel: 260, maxLevel: 360, element: "Veneno", stars: 7, overlay: "rgba(180,90,220,0.48)" },
  vale_fogo:         { name: "Vale Ígneo",        diff: "Mítico+",    bg: mapPedreiraCavernaUrl, rate: 8.0, minLevel: 330, maxLevel: 420, element: "Fogo",   stars: 7, overlay: "rgba(255,95,45,0.45)" },
  vulcao_ativo:      { name: "Vulcão Ativo",      diff: "PRIMORDIAL", bg: mapVictoryRoadUrl,     rate: 9.0, minLevel: 400, maxLevel: 470, element: "Fogo",   stars: 8 },
  nucleo_primordial: { name: "Núcleo Primordial", diff: "PRIMORDIAL", bg: mapVenenoUrl,          rate: 10.0, minLevel: 460, maxLevel: 500, element: "Misto", stars: 8 },
  // ═══ EVENTO GELIUS (a cada 2h, 10min de duração, troca de fase aos 5min) ═══
  gelius1: { name: "Gelius — Onda 1", diff: "EVENTO", bg: assetUrlFromJson(mapGelius1Asset), rate: 5.0, minLevel: 1,   maxLevel: 200,  element: "Gelo/Evento", stars: 5 },
  gelius2: { name: "Gelius — Onda 2", diff: "EVENTO", bg: assetUrlFromJson(mapGelius2Asset), rate: 7.0, minLevel: 400, maxLevel: 1000, element: "Gelo/Evento", stars: 8 },
  // ═══ EVENTO ODDISH ODYSSEY — 48h, abre 30min a cada 2h ═══
  oddish_o1: { name: "Odisséia Oddish — Bosque",   diff: "EVENTO", bg: assetUrlFromJson(mapOddish1Asset), rate: 8.0, minLevel: 1, maxLevel: 9999, element: "Planta/Caos", stars: 6 },
  oddish_o2: { name: "Odisséia Oddish — Clareira", diff: "EVENTO", bg: assetUrlFromJson(mapOddish2Asset), rate: 8.0, minLevel: 1, maxLevel: 9999, element: "Planta/Caos", stars: 6 },
  oddish_o3: { name: "Odisséia Oddish — Caverna Sombria", diff: "EVENTO", bg: mapOddish3Url, rate: 9.0, minLevel: 1, maxLevel: 9999, element: "Fantasma/Caos", stars: 7 },
  grass_oddish: { name: "🌿 Grass Oddish", diff: "EVENTO", bg: assetUrlFromJson(mapOddish1Asset), rate: 8.0, minLevel: 1, maxLevel: 9999, element: "Planta", stars: 6, overlay: "rgba(120,255,140,0.18)" },
  absol_start:      { name: "Continente do Governante — Absol", diff: "LENDÁRIO", bg: assetUrlFromJson(absolStartMapAsset),      rate: 4.0, minLevel: 1, maxLevel: 9999, element: "Sombrio/Lendário", stars: 8 },
  governante_hall:  { name: "Salão do Governante",              diff: "LENDÁRIO", bg: assetUrlFromJson(governanteHallMapAsset),  rate: 3.0, minLevel: 1, maxLevel: 9999, element: "Lendário",         stars: 9 },
  continent3_map1:  { name: "Fosso de Magma",                    diff: "MÍTICO++", bg: assetUrlFromJson(continent3Map1Asset),      rate: 45.0, minLevel: 6000, maxLevel: 8000, element: "Fogo/Lava",    stars: 10 },
  continent3_map2:  { name: "Pântano de Safira",                 diff: "DIVINO",   bg: assetUrlFromJson(continent3Map2Asset),      rate: 55.0, minLevel: 8000, maxLevel: 10000, element: "Veneno/Planta", stars: 10 },
};

type WorldPortalDef = { key: string; from: IdleMapId; to: IdleMapId; x: number; y: number; arriveX: number; arriveY: number; color: string; label: string; reqLevel?: number };
// Cadeia endgame — portais visíveis em todos os mapas, mas exigem nível de treinador para atravessar
const ENDGAME_CHAIN: Array<{ from: IdleMapId; to: IdleMapId; req: number; color: string }> = [
  { from: "terra",             to: "vale_rochas",       req: 40,  color: "#c9a76a" },
  { from: "vale_rochas",       to: "vale_planta",       req: 110, color: "#4ade80" },
  { from: "vale_planta",       to: "vale_gelo",         req: 180, color: "#7dd3fc" },
  { from: "vale_gelo",         to: "vale_veneno",       req: 250, color: "#c084fc" },
  { from: "vale_veneno",       to: "vale_fogo",         req: 320, color: "#fb923c" },
  { from: "vale_fogo",         to: "vulcao_ativo",      req: 390, color: "#ef4444" },
  { from: "vulcao_ativo",      to: "nucleo_primordial", req: 460, color: "#f0abfc" },
];
const WORLD_PORTALS: WorldPortalDef[] = ENDGAME_CHAIN.flatMap((c) => {
  const toName = IDLE_MAPS[c.to].name;
  const fromName = IDLE_MAPS[c.from].name;
  return [
    { key: `${c.from}->${c.to}`, from: c.from, to: c.to, x: 1720, y: 260, arriveX: 220, arriveY: 1660, color: c.color, label: toName, reqLevel: c.req },
    { key: `${c.to}->${c.from}`, from: c.to, to: c.from, x: 200, y: 1660, arriveX: 1700, arriveY: 260, color: "#94a3b8", label: `↩ ${fromName}` },
  ];
});

// Retorna se a caverna está atualmente aberta e ms para o próximo evento (abrir/fechar)
function caveWindow(now: number = Date.now()): { open: boolean; msUntilChange: number } {
  const c = IDLE_MAPS.caverna.cycle!;
  const t = now % c.cycleMs;
  if (t < c.openMs) return { open: true, msUntilChange: c.openMs - t };
  return { open: false, msUntilChange: c.cycleMs - t };
}

// Evento Mítico Shiny — abre 5 minutos a cada 1 hora.
function mythEventInfo(now: number = Date.now()): { open: boolean; msUntilChange: number } {
  const CYCLE = 60 * 60 * 1000;
  const OPEN = 5 * 60 * 1000;
  const t = now % CYCLE;
  if (t < OPEN) return { open: true, msUntilChange: OPEN - t };
  return { open: false, msUntilChange: CYCLE - t };
}

const GIF: Partial<Record<Species, string>> = {
  charizard: charizardGif, pikachu: pikachuGif,
  dragonite: dragoniteGif,
  bulbasaur: bulbasaurGif, charmander: charmanderGif, squirtle: squirtleGif,
  rattata_f: rattataFUrl, pidgey: pidgeyGif, zubat: zubatUrl,
  ekans: ekansUrl, machop: machopUrl, diglett: diglettUrl,
  meowth: meowthUrl, psyduck: psyduckUrl,
  lucario: lucarioAuraUrl, mew: mewAuraUrl,
  beedrill: beedrillGif, butterfree: butterfreeGif,
  pinsir: pinsirGif, golem: golemGif, jolteon: jolteonGif, lapras: laprasGif,
  blaziken: blazikenGif,
  virizion: assetUrlFromJson(virizionAsset), raikou: assetUrlFromJson(raikouAsset),
  suicune: assetUrlFromJson(suicuneAsset), suicune_shiny: assetUrlFromJson(suicuneShinyAsset),
  luxray_f: assetUrlFromJson(luxrayFAsset),
  oddish: oddishUrl, bellsprout: bellsproutUrl, weedle: weedleUrl, kakuna: kakunaUrl,
  caterpie: caterpieGif, metapod: metapodGif, vulpix: vulpixGif,
  paras: parasUrl, parasect: parasectUrl, venonat: venonatUrl, gloom: gloomUrl,
  clefairy: clefairyUrl, sandshrew: sandshrewUrl, mankey: mankeyUrl,
  poliwag: poliwagUrl, growlithe: growlitheUrl, abra: abraUrl,
  cubone: cuboneUrl, magnemite: magnemiteUrl, nidoran_f: nidoranFUrl, snorlax: snorlaxUrl,
  pidgeotto: pidgeottoUrl, raticate_f: raticateFUrl, fearow: fearowUrl,
  blastoise: blastoiseUrl, blastoise_shiny: blastoiseShinyUrl,
  deoxys: deoxysUrl, groudon: groudonUrl, lapras_shiny: laprasShinyUrl, snorlax_mythic: snorlaxMythicUrl, charizard_shiny: charizardShinyUrl,
  darkrai: darkraiUrl, ho_oh: hoOhUrl, magmortar: magmortarUrl,
  lugia: lugiaUrl, hariyama: hariyamaUrl, ursaring: ursaringUrl,
  ditto: dittoUrl, electabuzz: electabuzzUrl, gengar: gengarUrl, hitmontop: hitmontopUrl, magneton: magnetonUrl,
  ditto_shiny: dittoShinyUrl, scizor: scizorUrl, umbreon: umbreonUrl,
  infernape: infernapeUrl, krookodile: krookodileUrl, tyranitar: tyranitarUrl, nidoking_shiny: nidokingShinyUrl,
  dialga: dialgaUrl, rapidash: rapidashUrl, rapidash_shiny: rapidashShinyUrl, skarmory: skarmoryUrl,
  moltres: moltresUrl, zapdos: zapdosUrl, articuno: articunoUrl,
  abomasnow: abomasnowGif, cloyster: cloysterGif, cloyster_shiny: cloysterShinyGif,
  exeggutor: exeggutorGif, exeggutor_shiny: exeggutorShinyGif,
  feraligatr: feraligatrGif, heracross: heracrossGif, heracross_shiny: heracrossShinyGif,
  hitmonchan_shiny: hitmonchanShinyGif, kangaskhan: kangaskhanGif,
  meganium: meganiumGif, meganium_shiny: meganiumShinyGif,
  moltres_shiny: moltresShinyGif, onix_shiny: onixShinyGif,
  lickitung: assetUrlFromJson(lickitungGifAsset),
  lickitung_shiny: assetUrlFromJson(lickitungShinyGifAsset),
  mewtwo_event: assetUrlFromJson(mewtwoEventGifAsset),
  oddish_shiny: assetUrlFromJson(oddishShinyGifAsset),
  riolu: rioluUrl,
  raichu: raichuUrl,
  rayquaza: rayquazaUrl,
};



// Pokémons cujo sprite é uma spritesheet 4x4 (linhas = down/left/right/up, 4 frames de walk)
const SPRITE_SHEET: Partial<Record<Species, string>> = {
  lucario: lucarioAuraUrl,
  mew: mewAuraUrl,
};


const ENEMY_POOL: Species[] = ["rattata_f", "pidgey", "zubat", "ekans", "machop", "diglett", "meowth", "psyduck"];

// ============ Elemento por espécie (para FX de ataque) ============
type ElementFx = "grass" | "fire" | "water" | "electric" | "poison" | "psychic" | "ice" | "rock" | "fighting" | "flying" | "normal";
const SPECIES_ELEMENT: Partial<Record<Species, ElementFx>> = {
  // Grama/bicho
  bulbasaur: "grass", ivysaur: "grass", venusaur: "grass",
  oddish: "grass", gloom: "grass", vileplume: "grass",
  bellsprout: "grass", weepinbell: "grass", victreebel: "grass",
  paras: "grass", parasect: "grass",
  caterpie: "grass", metapod: "grass", butterfree: "flying",
  virizion: "grass",
  // Fogo
  charmander: "fire", charmeleon: "fire", charizard: "fire",
  growlithe: "fire", arcanine: "fire", ninetales: "fire", vulpix: "fire",
  magmar: "fire", flareon: "fire", moltres: "fire", blaziken: "fire",
  // Água
  squirtle: "water", wartortle: "water", blastoise: "water", blastoise_shiny: "water",
  psyduck: "water", golduck: "water",
  poliwag: "water", poliwhirl: "water", poliwrath: "fighting",
  magikarp: "water", gyarados: "water", vaporeon: "water", lapras: "water",
  suicune: "water", suicune_shiny: "water",
  // Elétrico
  pikachu: "electric", raichu: "electric", magnemite: "electric",
  jolteon: "electric", zapdos: "electric", luxray_f: "electric", raikou: "electric",
  // Veneno / bicho venenoso
  weedle: "poison", kakuna: "poison", beedrill: "poison",
  ekans: "poison", arbok: "poison",
  zubat: "poison", golbat: "poison",
  nidoran_f: "poison", nidorina: "poison", nidoqueen: "poison", nidoking: "poison",
  venonat: "poison", venomoth: "poison",
  // Psíquico
  abra: "psychic", kadabra: "psychic", alakazam: "psychic",
  mew: "psychic", mewtwo: "psychic",
  // Gelo
  articuno: "ice", abomasnow: "ice", cloyster: "ice", cloyster_shiny: "ice",
  // Pedra / terra
  diglett: "rock", dugtrio: "rock",
  sandshrew: "rock", sandslash: "rock",
  cubone: "rock", marowak: "rock",
  golem: "rock", geodude: "rock", graveler: "rock",
  // Fighting
  machop: "fighting", machoke: "fighting", machamp: "fighting",
  mankey: "fighting", primeape: "fighting",
  lucario: "fighting", pinsir: "fighting", riolu: "fighting",
  // Flying
  pidgey: "flying", pidgeotto: "flying", pidgeot: "flying",
  fearow: "flying", spearow: "flying", rayquaza: "flying",
  // Normal
  rattata_f: "normal", raticate_f: "normal",
  meowth: "normal", persian: "normal",
  eevee: "normal", snorlax: "normal", snorlax_mythic: "normal",
  clefairy: "normal", clefable: "normal",
  // Mythic Roamers
  deoxys: "psychic", groudon: "fire", lapras_shiny: "water",
  darkrai: "psychic", ho_oh: "fire", magmortar: "fire",
  lugia: "psychic", hariyama: "fighting", ursaring: "normal",
  // Guardiões Anti-Paralisia
  ditto: "normal", electabuzz: "electric", magneton: "electric",
  gengar: "poison", hitmontop: "fighting",
  ditto_shiny: "normal", scizor: "fighting", umbreon: "psychic",
  // Apex bosses
  infernape: "fire", krookodile: "rock", tyranitar: "rock", nidoking_shiny: "poison",
  dialga: "psychic", rapidash: "fire", rapidash_shiny: "fire", skarmory: "flying",


} as Record<string, ElementFx>;


function elementOf(sp: Species): ElementFx {
  return SPECIES_ELEMENT[sp] ?? "normal";
}
const ELEMENT_FX_IMG: Record<ElementFx, any> = {
  grass: fxGrassImg, fire: fxFireImg, water: fxWaterImg, electric: fxElectricImg,
  poison: fxPoisonImg, psychic: fxPsychicImg, ice: fxIceImg, rock: fxRockImg,
  fighting: fxFightingImg, flying: fxFlyingImg, normal: fxSlashImg,
};
const ELEMENT_FX_GLOW: Record<ElementFx, string> = {
  grass: "#66e07a", fire: "#ff8a3d", water: "#4dc4ff", electric: "#ffe14d",
  poison: "#c56bff", psychic: "#ff8bd6", ice: "#8ee8ff", rock: "#c69466",
  fighting: "#ffd166", flying: "#cfe9ff", normal: "#ffb84d",
};

// ============ Obstáculos com colisão ============
type Obstacle = {
  id: number;
  x: number; y: number;      // posição da BASE (chão) no mundo
  w: number; h: number;      // tamanho renderizado em px
  src: string;
  blocks: boolean;           // só pedras bloqueiam; árvores ficam visuais/transparentes ao passar
  collideR: number;          // raio de colisão em px (a partir da base)
};
// Gera obstáculos espalhados de forma determinística (mesma disposição sempre)
function buildObstacles(worldW: number, worldH: number, mapId: IdleMapId = "arena"): Obstacle[] {
  // PRNG determinístico simples
  let seed = mapId === "terra" ? 98765 : mapId === "fantasma" ? 66613 : 12345;
  const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

  // Cemitério Assombrado (fantasma): mesma composição do Ninho de Marimbondo,
  // porém re-tematizado — lápides gigantes no lugar dos casulos, árvores mortas ao redor.
  if (mapId === "fantasma") {
    const kinds = [
      { src: treeOakUrl,     w: 110, h: 124, collideR: 0,  blocks: false },
      { src: rockBoulderUrl, w:  86, h:  76, collideR: 10, blocks: true  },
    ];
    const list: Obstacle[] = [];
    let id = 1;
    // 4 lápides/portais espirituais espalhados (mesmos slots dos casulos)
    const graveSpots: { x: number; y: number }[] = [
      { x: worldW * 0.28, y: worldH * 0.30 },
      { x: worldW * 0.72, y: worldH * 0.28 },
      { x: worldW * 0.30, y: worldH * 0.72 },
      { x: worldW * 0.74, y: worldH * 0.70 },
    ];
    for (const c of graveSpots) {
      list.push({ id: id++, x: c.x, y: c.y, w: 120, h: 140, src: rockBoulderUrl, blocks: true, collideR: 42 });
    }
    // Enxame decorativo de zubats/venomoths espectrais
    const swarm: string[] = [zubatUrl, venonatUrl];
    let sTries = 0;
    let placed = 0;
    while (placed < 24 && sTries < 1500) {
      sTries++;
      const src = swarm[Math.floor(rand() * swarm.length)];
      const x = 80 + rand() * (worldW - 160);
      const y = 100 + rand() * (worldH - 200);
      let ok = true;
      for (const o of list) if (Math.hypot(x - o.x, y - o.y) < 120) { ok = false; break; }
      if (!ok) continue;
      list.push({ id: id++, x, y, w: 38, h: 38, src, blocks: false, collideR: 0 });
      placed++;
    }
    // Árvores mortas espalhadas evitando as lápides
    const MIN_GAP = 130;
    let tries = 0;
    while (list.length < graveSpots.length * 3 + 14 && tries < 2500) {
      tries++;
      const k = kinds[Math.floor(rand() * kinds.length)];
      const x = 80 + rand() * (worldW - 160);
      const y = 100 + rand() * (worldH - 200);
      let nearGrave = false;
      for (const c of graveSpots) if (Math.hypot(x - c.x, y - c.y) < 260) { nearGrave = true; break; }
      if (nearGrave) continue;
      let ok = true;
      for (const o of list) if (Math.hypot(x - o.x, y - o.y) < MIN_GAP) { ok = false; break; }
      if (!ok) continue;
      list.push({ id: id++, x, y, w: k.w, h: k.h, src: k.src, blocks: k.blocks, collideR: k.collideR });
    }
    return list;
  }

  // Pântano em Chamas (venofogo): MESMA composição do Vale Verdejante (arena),
  // porém re-tematizada — árvores/matos de fogo, 2 lagos de lava e um vulcão central.
  if (mapId === "venofogo") {
    const kinds = [
      { src: rockLavaUrl, w: 56, h: 50, collideR: 8, blocks: true },
    ];
    const list: Obstacle[] = [];
    let id = 1;

    // 2 lagos de lava pequenos (posições espelhadas, fora do centro)
    const lakeSpots: { x: number; y: number }[] = [
      { x: worldW * 0.22, y: worldH * 0.30 },
      { x: worldW * 0.78, y: worldH * 0.72 },
    ];
    for (const c of lakeSpots) {
      list.push({ id: id++, x: c.x, y: c.y, w: 130, h: 130, src: redLakeUrl, blocks: true, collideR: 52 });
    }

    // Vulcão central (grande, bloqueia — substitui o "centro limpo" do arena)
    const volcano = { x: worldW * 0.5, y: worldH * 0.5 };
    list.push({ id: id++, x: volcano.x, y: volcano.y, w: 240, h: 240, src: volcanoUrl, blocks: true, collideR: 96 });

    // Distribuição espalhada IDÊNTICA ao arena (mesmo seed, mesmos parâmetros),
    // apenas evitando lagos e o vulcão.
    const MIN_GAP = 60;
    let tries = 0;
    while (list.length < 18 && tries < 2000) {
      tries++;
      const k = kinds[Math.floor(rand() * kinds.length)];
      const x = 60 + rand() * (worldW - 120);
      const y = 80 + rand() * (worldH - 160);
      if (Math.hypot(x - volcano.x, y - volcano.y) < 180) continue;
      let nearLake = false;
      for (const c of lakeSpots) if (Math.hypot(x - c.x, y - c.y) < 130) { nearLake = true; break; }
      if (nearLake) continue;
      let ok = true;
      for (const o of list) if (Math.hypot(x - o.x, y - o.y) < MIN_GAP) { ok = false; break; }
      if (!ok) continue;
      list.push({ id: id++, x, y, w: k.w, h: k.h, src: k.src, blocks: k.blocks, collideR: k.collideR });
    }
    return list;
  }




  // Mapa Terra (Ninho de Marimbondo): 4 casulos gigantes espalhados com Beedrill/Butterfree ao redor
  if (mapId === "terra") {
    const kinds = [
      { src: treeOakUrl,     w: 110, h: 124, collideR: 0,  blocks: false },
      { src: rockBoulderUrl, w:  86, h:  76, collideR: 10, blocks: true  },
    ];
    const list: Obstacle[] = [];
    let id = 1;

    // 4 casulos espalhados (cantos + centro deslocado)
    const cocoonSpots: { x: number; y: number }[] = [
      { x: worldW * 0.28, y: worldH * 0.30 },
      { x: worldW * 0.72, y: worldH * 0.28 },
      { x: worldW * 0.30, y: worldH * 0.72 },
      { x: worldW * 0.74, y: worldH * 0.70 },
    ];
    for (const c of cocoonSpots) {
      list.push({ id: id++, x: c.x, y: c.y, w: 150, h: 180, src: hornetCocoonUrl, blocks: true, collideR: 42 });
      // Beedrill e Butterfree flutuando perto do casulo (decorativos, sem colisão)
      list.push({ id: id++, x: c.x - 60, y: c.y - 18, w: 40, h: 40, src: beedrillGif, blocks: false, collideR: 0 });
      list.push({ id: id++, x: c.x + 60, y: c.y - 10, w: 40, h: 40, src: butterfreeGif, blocks: false, collideR: 0 });
    }

    // Enxame extra de Beedrill/Butterfree bem espalhados pelo mapa
    const swarm: string[] = [beedrillGif, butterfreeGif];
    let sTries = 0;
    let placed = 0;
    while (placed < 30 && sTries < 1500) {
      sTries++;
      const src = swarm[Math.floor(rand() * swarm.length)];
      const x = 80 + rand() * (worldW - 160);
      const y = 100 + rand() * (worldH - 200);
      let ok = true;
      for (const o of list) if (Math.hypot(x - o.x, y - o.y) < 120) { ok = false; break; }
      if (!ok) continue;
      list.push({ id: id++, x, y, w: 38, h: 38, src, blocks: false, collideR: 0 });
      placed++;
    }

    // Poucas árvores/pedras espalhadas evitando zonas dos casulos
    const MIN_GAP = 130;
    let tries = 0;
    while (list.length < cocoonSpots.length * 3 + 14 && tries < 2500) {
      tries++;
      const k = kinds[Math.floor(rand() * kinds.length)];
      const x = 80 + rand() * (worldW - 160);
      const y = 100 + rand() * (worldH - 200);
      // afastar de qualquer casulo
      let nearCocoon = false;
      for (const c of cocoonSpots) if (Math.hypot(x - c.x, y - c.y) < 260) { nearCocoon = true; break; }
      if (nearCocoon) continue;
      let ok = true;
      for (const o of list) if (Math.hypot(x - o.x, y - o.y) < MIN_GAP) { ok = false; break; }
      if (!ok) continue;
      list.push({ id: id++, x, y, w: k.w, h: k.h, src: k.src, blocks: k.blocks, collideR: k.collideR });
    }
    return list;
  }


  const kinds = [
    { src: treeOakUrl,     w: 110, h: 124, collideR: 0,  blocks: false },
    { src: treePineUrl,    w:  90, h: 132, collideR: 0,  blocks: false },
    { src: rockBoulderUrl, w:  86, h:  76, collideR: 10, blocks: true  },
    { src: bushBerryUrl,   w:  64, h:  60, collideR: 0,  blocks: false },
  ];
  const list: Obstacle[] = [];
  const MIN_GAP = 60;
  const CENTER_CLEAR = 180; // não spawnar em cima da posição inicial (centro)
  let id = 1;
  let tries = 0;
  while (list.length < 90 && tries < 4000) {
    tries++;
    const k = kinds[Math.floor(rand() * kinds.length)];
    const x = 60 + rand() * (worldW - 120);
    const y = 80 + rand() * (worldH - 160);
    if (Math.hypot(x - worldW / 2, y - worldH / 2) < CENTER_CLEAR) continue;
    let ok = true;
    for (const o of list) {
      if (Math.hypot(x - o.x, y - o.y) < MIN_GAP) { ok = false; break; }
    }
    if (!ok) continue;
    list.push({ id: id++, x, y, w: k.w, h: k.h, src: k.src, blocks: k.blocks, collideR: k.collideR });
  }
  return list;
}

type Task = { id: string; title: string; reward: number; progress: number; target: number; done: boolean };
type IdleState = {
  startedAt: number;
  lastTickAt: number;
  pending: { gold: number; rubies: number; crystals: number };
  totals: { gold: number; captured: number; kills?: number };
  currentMap: IdleMapId;
  tasks: Task[];
  mapsUnlocked: number;
  caughtSpecies: Species[];
  seenSpecies: Species[];
  collection?: CollectionEntry[];
  craftPoints?: number;
  items: Record<string, number>;
  bank: { gold: number; crystals: number };
  buffs: { atk: number; def: number; expMult: number; expMultUntil?: number; goldMult?: number; goldMultUntil?: number; honeyUntil?: number; honeyRareUntil?: number; orbMult?: number; orbUntil?: number; orbId?: string; teamOrbUntil?: number };
  globalStats?: { attack: number; speed: number; synergy: number; resistance: number; mastery: number };
  autoHeal: { enabled: boolean; threshold: number };
  autoBattle?: { enabled: boolean; useBall: boolean; preferredBall: "auto" | "pokeball" | "greatball" | "ultraball"; captureHpPct: number };
  trainerLevel?: number;
  trainerXp?: number;
  unlockedSkins?: string[];
  hives?: Record<string, { slots: Array<{ uid: string; startedAt: number } | null> }>;
  redeemedCodes?: Record<string, boolean>;
  blackMiticPlusPending?: number;
  grassOddishCaptured?: number;
  grassOddishReturnMap?: IdleMapId;
};

export type CollectionEntry = { uid: string; species: Species; level: number; rarity: Rarity; capturedAt: number; xp?: number; traits?: string[]; event?: string };

export const MAX_COLLECTION = 500;

const GOVERNANTE_PLUS_POOL: readonly Species[] = [
  "mewtwo", "mew", "groudon", "lugia", "ho_oh",
  "moltres", "zapdos", "articuno", "raikou", "suicune",
  "dialga", "darkrai", "snorlax_mythic", "tyranitar",
  "lucario", "scizor", "dragonite_shiny", "charizard_shiny", "blastoise_shiny",
];

const GOVERNANTE_PLUS_TRAITS = ["prismatico", "alpha", "esquivo", "dourado", "prodigio", "eterno"];

// Pool de 50 espécies elegíveis para o Painel de Troca Black Mitic Plus (código RESGTT55).
const BMP_SWAP_POOL: readonly Species[] = [
  "charizard_shiny", "blastoise_shiny", "dragonite_shiny", "mewtwo",
  "mewtwo_event", "lugia", "ho_oh", "moltres", "zapdos",
  "articuno", "moltres_shiny", "raikou", "suicune", "suicune_shiny",
  "dialga", "darkrai", "deoxys", "groudon", "lapras_shiny",
  "snorlax_mythic", "tyranitar", "scizor", "gengar",
  "umbreon", "infernape", "krookodile", "nidoking_shiny", "rapidash_shiny",
  "skarmory", "heracross_shiny", "meganium_shiny", "exeggutor_shiny", "cloyster_shiny",
  "onix_shiny", "hitmonchan_shiny", "lickitung_shiny", "kangaskhan", "feraligatr",
  "blaziken", "pinsir", "golem", "jolteon", "lapras",
  "virizion", "luxray_f", "abomasnow", "riolu", "charizard",
  // +20 novos
  "venusaur", "pikachu", "gyarados", "machamp", "arcanine",
  "dragonite", "blaziken", "raichu", "ninetales", "magmortar",
  "aerodactyl", "kabutops", "primeape", "hariyama", "ursaring",
  "magmar", "snorlax", "magneton", "electabuzz", "vaporeon_shiny",
] as const;

export const CRAFT_BY_RARITY: Record<Rarity, number> = {
  common: 1,
  uncommon: 3,
  rare: 8,
  epic: 20,
  legendary: 60,
  mythic: 200,
  mythic_shiny: 600,
};

const DEFAULT_TASKS = (): Task[] => [
  { id: "t1", title: "Derrote 30 Pokémon selvagens", reward: 3, progress: 0, target: 30, done: false },
  { id: "t2", title: "Colete 5000 de ouro offline",   reward: 2, progress: 0, target: 5000, done: false },
  { id: "t3", title: "Capture 10 Pokémon",            reward: 4, progress: 0, target: 10, done: false },
];

// Itens farmáveis (drop aleatório dos inimigos derrotados)
const ITEM_ICONS: Record<string, LucideIcon> = {
  potion: FlaskConical, pokeball: Sparkles,
};
const ITEM_COLORS: Record<string, string> = {
  potion: "#ff6b8a", pokeball: "#ff5252",
  greatball: "#4a7bff", ultraball: "#f5cf6b",
  chest_amulet: "#f5cf6b",
  revive: "#ff5b8a", berry: "#4a7bff", key: "#f5cf6b",
  book_atk: "#ff5252", book_def: "#4a7bff", book_exp: "#5ec26a",
  book_exp_big: "#8bffb0", book_exp_max: "#ffd94d", book_vip: "#ffb347",
};
const ITEM_IMG: Record<string, any> = {
  potion: potionNewImg,
  pokeball: ballPokeImg, greatball: ballGreatImg, ultraball: ballUltraImg,
  chest_amulet: chestAmuletImg,
  revive: reviveIconImg, berry: berryIconImg, key: keyIconImg,
  book_atk: bookAtkImg, book_def: bookDefImg, book_exp: bookExpImg,
  book_exp_big: bookExpImg, book_exp_max: bookExpImg, book_vip: bookExpImg,
  premium_box: premiumBoxImg,
  bau_esmeralda: chestEmeraldImg,
  orb_xp_minor: orbXpMinorUrl, orb_xp_major: orbXpMajorUrl, orb_xp_supreme: orbXpSupremeUrl, orb_team: orbXpTeamUrl,
  orb_xp_supreme_24h: (new URL("../assets/orb-24h.png", import.meta.url)).href,
  incenso_mel_raro_24h: (new URL("../assets/incense-24h.png", import.meta.url)).href,
  safira_verde: assetUrlFromJson(safiraVerdeAsset),
};
const ITEM_POOL: { id: string; name: string; icon: string; chance: number }[] = [
  { id: "potion",    name: "Poção",     icon: "🧪", chance: 0.30 },
  { id: "pokeball",  name: "Pokébola",  icon: "🔴", chance: 0.15 },
  { id: "berry",     name: "Berry",     icon: "🫐", chance: 0.12 },
  { id: "revive",    name: "Revive",    icon: "💖", chance: 0.05 },
  { id: "key",       name: "Chave",     icon: "🗝", chance: 0.03 },
];

// Loja — Pokébolas por gold, livros por cristal
type ShopBall = { id: "pokeball" | "greatball" | "ultraball" | "masterball"; name: string; price: number; img: any; captureMult: number };
const SHOP_BALLS: ShopBall[] = [
  { id: "pokeball",   name: "Pokébola",   price: 500,    img: ballPokeImg,  captureMult: 1 },
  { id: "greatball",  name: "Great Ball", price: 5000,   img: ballGreatImg, captureMult: 2 },
];
// Catálogo COMPLETO usado no cálculo de captura (inclui bolas que não são
// vendidas na loja mas o jogador pode ter dropado / recebido de eventos).
const ALL_BALLS: ShopBall[] = [
  { id: "pokeball",   name: "Pokébola",   price: 500,    img: ballPokeImg,  captureMult: 1 },
  { id: "greatball",  name: "Great Ball", price: 5000,   img: ballGreatImg, captureMult: 2 },
  { id: "ultraball",  name: "Ultra Ball", price: 15000,  img: ballUltraImg, captureMult: 3.5 },
  { id: "masterball", name: "Master Ball", price: 999999, img: ballUltraImg, captureMult: 999 },
];

type ShopBook = { id: "book_atk" | "book_def" | "book_exp" | "book_exp_big" | "book_exp_max" | "book_vip" | "book_vip_30" | "book_vip_60" | "orb_xp_minor" | "orb_xp_major" | "orb_xp_supreme" | "orb_team"; name: string; desc: string; price: number; img: any; currency?: "crystals" | "gold"; priceGold?: number };
const SHOP_BOOKS: ShopBook[] = [
  { id: "book_atk", name: "Livro de Ataque", desc: "+10% de dano permanente por uso", price: 100, img: bookAtkImg },
  { id: "book_def", name: "Livro de Defesa", desc: "-10% de dano recebido por uso",  price: 100, img: bookDefImg },
  { id: "book_exp", name: "Livro de EXP",    desc: "+30% EXP em batalhas por 1 hora",   price: 30, img: bookExpImg },

  { id: "book_vip_30", name: "Livro VIP 30d ✦✦", desc: "+30% ouro e +30% EXP por 30 DIAS", price: 500, img: bookExpImg },
  { id: "book_vip_60", name: "Livro VIP 60d ✦✦✦", desc: "+40% ouro e +40% EXP por 60 DIAS", price: 1000, img: bookExpImg },
  // ═══ ORB DE XP FRACO — único vendido; os fortes vêm da troca com NPC ═══
  { id: "orb_xp_minor",   name: "Orb de XP Menor ✦",   desc: "+10% EXP por 1 hora (apenas 1 orb ativo, stack com livro)", price: 100,  img: orbXpMinorUrl,   currency: "crystals", priceGold: 50000 },
  // ═══ ORB DE TIME — distribui EXP para todos os pokémons do time por 1 hora ═══
  { id: "orb_team",       name: "Orb de Time ✦✦✦",     desc: "Todo o time ganha EXP nas batalhas por 3 horas (sem +% de EXP)", price: 2000, img: orbXpTeamUrl,   currency: "crystals" },
];


const POTION_PRICE = 100;
const POTION_HEAL_PCT = 0.5;

// Espécies desbloqueadas por nível do líder — spawn cresce com o progresso
const LEVEL_UNLOCKS: { minLv: number; species: Species[] }[] = [
  { minLv: 1,  species: ["rattata_f", "pidgey"] },
  { minLv: 3,  species: ["zubat", "ekans"] },
  { minLv: 6,  species: ["meowth", "psyduck"] },
  { minLv: 10, species: ["diglett", "machop"] },
  { minLv: 15, species: ["bulbasaur", "charmander", "squirtle"] },
  { minLv: 18, species: ["jolteon", "lapras"] },
  { minLv: 20, species: ["pikachu"] },
  { minLv: 25, species: ["pinsir", "golem"] },
  { minLv: 30, species: ["charizard"] },
  { minLv: 36, species: ["blaziken"] },
];
function speciesUnlockedFor(lv: number): Species[] {
  const list: Species[] = [];
  for (const u of LEVEL_UNLOCKS) if (lv >= u.minLv) list.push(...u.species);
  return list.length ? list : ["rattata_f"];
}

function loadIdle(): IdleState {
  if (typeof window === "undefined") return freshIdle();
  try {
    const raw = localStorage.getItem(IDLE_KEY);
    if (raw) {
      const s: IdleState = { ...freshIdle(), ...JSON.parse(raw) };
      // Presente de boas-vindas (evento): 1x Caixa Premium
      const flags = (s as unknown as { flags?: Record<string, boolean> }).flags ?? {};
      if (!flags.giftPremiumBoxV1) {
        s.items = { ...(s.items ?? {}), premium_box: (s.items?.premium_box ?? 0) + 1 };
        (s as unknown as { flags: Record<string, boolean> }).flags = { ...flags, giftPremiumBoxV1: true };
      }
      // Auto-Poção sempre ativada ao entrar no jogo (usuário pode desativar depois na sessão)
      s.autoHeal = { ...(s.autoHeal ?? { threshold: 0.5, enabled: true }), enabled: true };
      // Garante lista de skins desbloqueadas (default sempre incluída)
      const uskins = Array.isArray(s.unlockedSkins) ? s.unlockedSkins.slice() : [];
      if (!uskins.includes("default")) uskins.unshift("default");
      s.unlockedSkins = uskins;
      // Sanitiza mapa removido (Pedreira Antiga)
      if (!IDLE_MAPS[s.currentMap]) s.currentMap = "arena";
      return s;
    }
  } catch { /* ignore */ }
  return freshIdle();
}
function freshIdle(): IdleState {
  const now = Date.now();
  return {
    startedAt: now, lastTickAt: now,
    pending: { gold: 0, rubies: 0, crystals: 0 },
    totals: { gold: 0, captured: 0, kills: 0 },
    currentMap: "arena",
    tasks: DEFAULT_TASKS(),
    mapsUnlocked: 3,
    caughtSpecies: [],
    seenSpecies: [],
    collection: [],
    craftPoints: 0,
    items: { premium_box: 1 },
    bank: { gold: 0, crystals: 30 },
    buffs: { atk: 0, def: 0, expMult: 0, expMultUntil: 0, goldMult: 0, goldMultUntil: 0, honeyUntil: 0, honeyRareUntil: 0, orbMult: 0, orbUntil: 0, orbId: "", teamOrbUntil: 0 },
    globalStats: { attack: 0, speed: 0, synergy: 0, resistance: 0, mastery: 0 },
    autoHeal: { enabled: true, threshold: 0.5 },
    autoBattle: { enabled: true, useBall: true, preferredBall: "auto", captureHpPct: 1 },
    trainerLevel: 1,
    trainerXp: 0,
    unlockedSkins: ["default"],
    redeemedCodes: {},
  };
}
function saveIdle(s: IdleState) {
  try { localStorage.setItem(IDLE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

// XP-para-o-próximo-nível do TREINADOR (curva um pouco mais dura que a do pokémon)
function trainerXpToNext(lv: number): number {
  return 150 + lv * 80;
}
// Aplica ganho de XP ao treinador e resolve level-ups em cadeia
function applyTrainerXp(s: IdleState, gained: number): { state: IdleState; leveledTo: number | null } {
  const startLv = s.trainerLevel ?? 1;
  let lv = startLv;
  let xp = (s.trainerXp ?? 0) + Math.max(0, Math.floor(gained));
  while (lv < 10000 && xp >= trainerXpToNext(lv)) { xp -= trainerXpToNext(lv); lv += 1; }
  return {
    state: { ...s, trainerLevel: lv, trainerXp: xp },
    leveledTo: lv > startLv ? lv : null,
  };
}

const IDLE_HP_MULT = 6;
function calcIdleMaxHp(pet: PetInstance) {
  return calcMaxHp(pet) * IDLE_HP_MULT;
}

function highLevelEnemyHpMult(enemyLevel: number, leaderLevel: number) {
  if (enemyLevel < 200) return 1;
  // 200=1.45x · 250=1.9x · 300=2.6x · 350=3.4x · 400=4.3x · 450=5.2x · 500=6.0x
  let mult = 1.45;
  if (enemyLevel >= 200) mult += Math.min(0.55, (enemyLevel - 200) / 100);   // até 300 → +0.55 (=2.0)
  if (enemyLevel >= 300) mult += Math.min(1.6, (enemyLevel - 300) / 100 * 0.8); // 300→500: +0..1.6 (=3.6)
  if (enemyLevel >= 400) mult += Math.min(1.0, (enemyLevel - 400) / 100);       // 400→500: mais +1
  if (enemyLevel >= 250) {
    const gap = Math.max(0, enemyLevel - leaderLevel);
    mult *= 1.15 + Math.min(1.6, gap * 0.045);
  }
  return mult;
}

function highLevelEnemyDamageMult(enemyLevel: number, leaderLevel: number) {
  if (enemyLevel < 200) return 1;
  // Curva de dano progressiva 200→500 (mais agressiva a partir de 300)
  let mult = 1.55;
  if (enemyLevel >= 200) mult += Math.min(0.65, (enemyLevel - 200) / 100 * 0.65);
  if (enemyLevel >= 300) mult += Math.min(1.4, (enemyLevel - 300) / 100 * 0.7);
  if (enemyLevel >= 400) mult += Math.min(0.9, (enemyLevel - 400) / 100 * 0.9);
  if (enemyLevel >= 250) {
    const gap = Math.max(0, enemyLevel - leaderLevel);
    mult *= 1.2 + Math.min(2.2, gap * 0.055);
  }
  return mult;
}

function playerDamageVsHighLevelMult(_leaderLevel: number, _enemyLevel: number) {
  // Sem restrição por diferença de nível — jogador causa dano cheio em qualquer alvo.
  return 1;
}


// ===== Energia por raridade =====
// Regen passivo (0→100) SÓ conta quando o pokémon está fora do time (na coleção).
// Enquanto está no time ativo, a energia apenas DRENA — raridade define quanto
// tempo ele aguenta em atividade antes de cansar.
const ENERGY_REGEN_MS: Partial<Record<Rarity, number>> = {
  common: 30 * 60 * 1000, uncommon: 50 * 60 * 1000,
  rare: 110 * 60 * 1000, epic: 180 * 60 * 1000, legendary: 180 * 60 * 1000,
  mythic: 0, mythic_shiny: 0,
};

// Duração (segundos) que 100 de energia dura em auto-battle como líder.
const ENERGY_ACTIVE_DURATION_S: Partial<Record<Rarity, number>> = {
  common: 25 * 60,       // 25 min
  uncommon: 35 * 60,     // 35 min
  rare: 1 * 3600,        // 1 h
  epic: 2 * 3600,        // 2 h
  legendary: 5 * 3600,   // 5 h
  mythic: 0, mythic_shiny: 0,
};
function energyDrainPerSec(rarity: Rarity): number {
  const dur = ENERGY_ACTIVE_DURATION_S[rarity] ?? 5 * 60;
  return dur === 0 ? 0 : ENERGY_MAX / dur;
}
function energyDrainPerKill(rarity: Rarity): number {
  const dur = ENERGY_ACTIVE_DURATION_S[rarity] ?? 5 * 60;
  if (dur === 0) return 0;
  // ~30s de atividade equivalente por kill
  return Math.max(1, Math.round((30 / dur) * ENERGY_MAX));
}

const ENERGY_MAX = 100;
const AZUL_REST_MS = 5 * 60 * 1000;
const AZUL_REST_FREE_MS = 60 * 60 * 1000; // 1h grátis quando não há cristais
const AZUL_REST_COST = 5; // diamantes
type PetEnergyExt = PetInstance & { energy?: number; energyRegenAt?: number; azulRestUntil?: number; azulRestFromEnergy?: number; azulRestTotalMs?: number };
function petCurrentEnergy(pet: PetInstance, now: number = Date.now(), opts?: { active?: boolean }): number {
  const p = pet as PetEnergyExt;
  const regen = ENERGY_REGEN_MS[pet.rarity] ?? 20 * 60 * 1000;
  if (regen === 0) return ENERGY_MAX;
  if (p.azulRestUntil && p.azulRestUntil > now) {
    const total = p.azulRestTotalMs ?? AZUL_REST_MS;
    const start = p.azulRestUntil - total;
    const t = Math.max(0, Math.min(1, (now - start) / total));
    const base = p.azulRestFromEnergy ?? p.energy ?? ENERGY_MAX;
    return Math.round(base + (ENERGY_MAX - base) * t);
  }

  const stored = p.energy ?? ENERGY_MAX;
  // No time ativo: sem regen passivo — só drena.
  if (opts?.active) return Math.max(0, Math.min(ENERGY_MAX, Math.round(stored)));

  const regenAt = p.energyRegenAt ?? now;
  const gain = ((now - regenAt) / regen) * ENERGY_MAX;
  return Math.max(0, Math.min(ENERGY_MAX, Math.round(stored + gain)));
}
function petMsToFull(pet: PetInstance, now: number = Date.now()): number {
  const p = pet as PetEnergyExt;
  if ((ENERGY_REGEN_MS[pet.rarity] ?? 0) === 0) return 0;
  if (p.azulRestUntil && p.azulRestUntil > now) return p.azulRestUntil - now;
  const cur = petCurrentEnergy(pet, now);
  if (cur >= ENERGY_MAX) return 0;
  const regen = ENERGY_REGEN_MS[pet.rarity] ?? 20 * 60 * 1000;
  return Math.round(((ENERGY_MAX - cur) / ENERGY_MAX) * regen);
}
function petIsExhausted(pet: PetInstance, now: number = Date.now(), opts?: { active?: boolean }): boolean {
  const infinite = (ENERGY_REGEN_MS[pet.rarity] ?? 0) === 0;
  if (infinite) return false;
  const p = pet as PetEnergyExt;
  if (p.azulRestUntil && p.azulRestUntil > now) return true;
  return petCurrentEnergy(pet, now, opts) <= 0;
}
function fmtMS(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60), r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}


// ============ Default team (usa save se existir) — APENAS 1 pokemon ============
type SaveShape = { party?: PetInstance[] };
function loadTeam(): PetInstance[] {
  const save = loadLatestValid<SaveShape>();
  if (save?.party && save.party.length > 0) {
    const leader = save.party[0];
    // upgrade forçado: se ainda for o antigo default (charizard lv15), troca por charmander lv1
    if (leader.species === "charizard" && leader.level === 15 && (leader.xp ?? 0) === 0) {
      return [makePet("charmander", 1)];
    }
    return save.party.slice(0, 1);
  }
  return [makePet("charmander", 1)];
}


function fmtHMS(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
function fmtK(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(Math.floor(n));
}

function getMultiplayerSessionId(baseId: string) {
  if (typeof window === "undefined") return baseId;
  try {
    let id = sessionStorage.getItem(MP_SESSION_KEY);
    if (!id) {
      const suffix = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      id = `${baseId}:${suffix}`;
      sessionStorage.setItem(MP_SESSION_KEY, id);
    }
    return id;
  } catch {
    return `${baseId}:${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

// ============ Route ============

export const Route = createFileRoute("/idle")({ 
  component: () => <AuthGate><IdlePage /></AuthGate> 
});

function IdlePage() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [gold, setGold] = useState(0);
  const [goldAnimations, setGoldAnimations] = useState<{id: number, x: number, y: number, amount: number}[]>([]);
  const [worldMapOpen, setWorldMapOpen] = useState(false);
  const [currentMap, setCurrentMap] = useState("arena");
  
  const map = IDLE_MAPS[currentMap as IdleMapId] || IDLE_MAPS.arena;

  const dropGold = (amount: number, x: number, y: number) => {
    const id = Date.now();
    setGold(prev => prev + amount);
    setGoldAnimations(prev => [...prev, { id, x, y, amount }]);
    setTimeout(() => {
      setGoldAnimations(prev => prev.filter(a => a.id !== id));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0b0510] text-white font-sans overflow-hidden selection:bg-purple-500/30">
      {/* HUD Superior */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-md border-b border-purple-500/20 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
            <img src={assetUrlFromJson(navWallet)} className="w-5 h-5 object-contain" alt="Gold" />
            <span className="text-yellow-400 font-bold tabular-nums">{gold.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={() => setWorldMapOpen(true)}
             className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg transition-all active:scale-95 shadow-lg shadow-purple-900/20"
           >
             <img src={assetUrlFromJson(iconWorldGlobe)} className="w-5 h-5 object-contain" alt="Map" />
             <span className="font-bold text-sm">MAPA MUNDI</span>
           </button>
        </div>
      </div>

      {/* Área Principal do Jogo */}
      <div className="pt-20 pb-24 px-4 max-w-7xl mx-auto h-screen flex flex-col">
        <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden group">
            {/* Mapa Ativo */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ 
                backgroundImage: `url(${assetUrlFromJson(map.bg)})`,
                imageRendering: 'pixelated'
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                dropGold(10, e.clientX - rect.left, e.clientY - rect.top);
              }}
            />
            
            {/* Animações de Gold */}
            {goldAnimations.map(anim => (
              <div 
                key={anim.id}
                className="absolute pointer-events-none flex flex-col items-center animate-bounce"
                style={{ left: anim.x - 20, top: anim.y - 40 }}
              >
                <img src={assetUrlFromJson(chestClosedImg)} className="w-8 h-8 object-contain" alt="Chest" />
                <span className="text-yellow-400 font-bold text-sm shadow-black drop-shadow-md">+{anim.amount}</span>
              </div>
            ))}
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/60 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center max-w-xs">
                    <p className="text-purple-300 text-sm mb-2">MAPA ATUAL</p>
                    <h3 className="text-xl font-bold mb-1">{map.name}</h3>
                    <p className="text-xs text-white/50">Nível {map.minLevel}-{map.maxLevel || "???"}</p>
                    <button className="mt-4 pointer-events-auto bg-white/10 px-4 py-2 rounded-lg text-xs hover:bg-white/20">DETALHES</button>
                </div>
            </div>
        </div>
      </div>

      {/* World Map Overlay */}
      {worldMapOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="relative w-full max-w-5xl aspect-video bg-[#1a0d2a] rounded-3xl border-4 border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-500/20">
              <div className="absolute top-6 left-6 z-10">
                <h2 className="text-3xl font-black text-white tracking-tighter drop-shadow-lg">MAPA MUNDI 2D</h2>
                <p className="text-purple-400 font-medium">Selecione uma região para viajar</p>
              </div>
              
              <button 
                onClick={() => setWorldMapOpen(false)}
                className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-red-500/80 p-2 rounded-full transition-colors group"
              >
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div 
                className="w-full h-full bg-cover bg-center opacity-40 mix-blend-overlay"
                style={{ backgroundImage: `url(${assetUrlFromJson(worldMapGlobeAsset)})` }}
              />
              
              {/* Region Markers */}
              <div className="absolute inset-0 p-10 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4">
                 {Object.entries(IDLE_MAPS).map(([id, def]) => (
                   <button 
                     key={id}
                     onClick={() => { setCurrentMap(id); setWorldMapOpen(false); }}
                     className="bg-black/40 border border-purple-500/30 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-purple-500/20 transition-all"
                   >
                     <img src={assetUrlFromJson(def.bg)} className="w-full h-20 object-cover rounded-lg" alt={def.name} />
                     <span className="font-bold text-sm text-purple-200">{def.name}</span>
                     <span className="text-[10px] text-white/40">Lv {def.minLevel}-{def.maxLevel || "???"}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Nav Inferior */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
        <div className="max-w-md mx-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex justify-between pointer-events-auto shadow-2xl">
          {[
            { id: "inicio", icon: navInicio, label: "Início" },
            { id: "pokemon", icon: navPokemon, label: "Pets" },
            { id: "mochila", icon: navMochila, label: "Bag" },
            { id: "market", icon: navMarket, label: "Market" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-purple-600/20 text-purple-400' : 'text-white/40 hover:text-white/60'}`}
            >
              <img src={assetUrlFromJson(tab.icon)} className={`w-6 h-6 object-contain ${activeTab === tab.id ? '' : 'grayscale opacity-50'}`} alt={tab.label} />
              <span className="text-[10px] font-bold uppercase">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ Componentes visuais auxiliares ============
function Panel({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#1a0f26",
      border: `2px solid ${accent}66`,
      borderRadius: 12,
      padding: 14,
      boxShadow: "0 6px 20px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.2)",
      marginBottom: 8,
    }}>
      <div style={{
        fontSize: 12, fontWeight: 900, color: "#eadfe8",
        marginBottom: 10, letterSpacing: 2, display: "flex",
        alignItems: "center", gap: 8
      }}>
        <div style={{ width: 4, height: 14, background: accent, borderRadius: 2 }} />
        {title.toUpperCase()}
      </div>
      {children}
    </div>
  );
}

function TabOverlay({ tab, onClose, ...props }: any) {
    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase text-purple-400">{tab}</h2>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-red-500 transition-colors">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="p-8 text-center text-white/50 italic">
                    Sistema de {tab} em manutenção estrutural...
                </div>
            </div>
        </div>
    );
}

function AuthGate({ children }: any) { return <>{children}</>; }
