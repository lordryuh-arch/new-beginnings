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
export const Route = createFileRoute("/idle")({ component: () => <IdlePage /> });
function IdlePage() {
  return (
    <div style={{ padding: 20, color: "white", background: "#0b0510", minHeight: "100vh" }}>
      <h1>RubyM Idle - Pokémon RPG</h1>
      <p>O jogo está sendo otimizado. Aguarde um momento enquanto restauramos as funcionalidades...</p>
    </div>
  );
}
function Panel({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#1a0f26",
      border: "1px solid rgba(245,207,107,0.2)",
      borderRadius: 10, overflow: "hidden",
    }}>
      <div style={{
        background: accent, color: "#fff",
        padding: "6px 10px", fontWeight: 700, fontSize: 12,
        letterSpacing: 1,
      }}>{title}</div>
      <div style={{ padding: 10 }}>{children}</div>
    </div>
  );
}

function TeamRow({ pet, onClick, energyTick }: { pet: PetInstance; onClick?: () => void; energyTick?: number }) {
  void energyTick; // força re-render por segundo p/ atualizar barra de energia
  const src = GIF[pet.species];
  const now = Date.now();
  const energy = petCurrentEnergy(pet, now, { active: true });
  const msFull = petMsToFull(pet, now);
  const infinite = (ENERGY_REGEN_MS[pet.rarity] ?? 0) === 0;
  const resting = !!(pet as PetEnergyExt).azulRestUntil && ((pet as PetEnergyExt).azulRestUntil! > now);
  if (!src) {
    return (
      <div onClick={onClick} style={{ display: "flex", gap: 8, alignItems: "center", background: "#2a1a3a", padding: 6, borderRadius: 6, cursor: onClick ? "pointer" : undefined }}>
        <div style={{ width: 48, height: 48, background: "#0b0510", borderRadius: 6, display: "grid", placeItems: "center", fontSize: 20 }}>❓</div>
        <div style={{ flex: 1, fontSize: 12 }}>
          <div style={{ fontWeight: 600 }}>{pet.species.replace(/_/g, " ").toUpperCase()}</div>
          <div style={{ fontSize: 10, color: "#b8a8c8" }}>Lv.{pet.level}</div>
        </div>
      </div>
    );
  }
  const maxHp = calcIdleMaxHp(pet);
  const hp = pet.hp ?? maxHp;
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const ePct = Math.max(0, Math.min(100, energy));
  const exhausted = !infinite && energy <= 0;
  const rarityColorMap: Record<string, string> = {
    common: "#9aa0a6", uncommon: "#5ec26a", rare: "#6bd4ff",
    epic: "#c084fc", legendary: "#f5cf6b", mythic: "#ff6b3d", mythic_shiny: "#ff97e1",
  };
  const rColor = rarityColorMap[pet.rarity] ?? "#c8b8d0";
  const hexToRgba = (h: string, a: number) => {
    const n = parseInt(h.replace("#", ""), 16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
  };
  return (
    <div onClick={onClick} title={exhausted ? "Sem energia — descanse na Casa Azul" : "Clique para ver detalhes"} style={{
      display: "flex", gap: 8, alignItems: "center",
      background: exhausted
        ? "linear-gradient(135deg, #14101a 0%, #1a1420 100%)"
        : `linear-gradient(135deg, ${hexToRgba(rColor, 0.22)} 0%, rgba(11,5,16,0.85) 100%)`,
      padding: "5px 8px 5px 5px",
      borderRadius: 10,
      cursor: onClick ? "pointer" : undefined,
      border: resting ? "1px solid #4a9eff" : (exhausted ? "1px solid #333" : `1px solid ${hexToRgba(rColor, 0.7)}`),
      boxShadow: exhausted
        ? "inset 0 1px 0 rgba(255,255,255,0.03)"
        : `0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 ${hexToRgba(rColor, 0.28)}, 0 0 10px ${hexToRgba(rColor, 0.18)}`,
      opacity: exhausted ? 0.6 : 1,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Selo lateral (barra fina de raridade) */}
      <span style={{
        position: "absolute", left: 0, top: 6, bottom: 6, width: 2,
        background: `linear-gradient(180deg, ${rColor}, ${hexToRgba(rColor, 0.3)})`,
        borderRadius: 2,
        boxShadow: `0 0 5px ${rColor}88`,
      }} />
      {/* pulse animado quando saudável */}
      {!exhausted && (
        <span style={{
          position: "absolute", inset: 0, borderRadius: 10, pointerEvents: "none",
          boxShadow: `inset 0 0 12px ${hexToRgba(rColor, 0.15)}`,
          animation: "teamPulse 2.6s ease-in-out infinite",
        }} />
      )}

      {/* Retrato circular clássico com moldura dourada */}
      <div style={{
        width: 46, height: 46, flexShrink: 0,
        borderRadius: "50%",
        background: exhausted
          ? "linear-gradient(160deg, #3a3040, #1a141c)"
          : `conic-gradient(from 45deg, #ffe89a, #b8862a, #6b3d0a, #ffd66b, #ffe89a)`,
        padding: 1.5,
        boxShadow: exhausted
          ? "0 1px 3px rgba(0,0,0,0.5)"
          : `0 2px 5px rgba(0,0,0,0.65), 0 0 8px ${hexToRgba(rColor, 0.5)}, inset 0 0 2px rgba(0,0,0,0.4)`,
        position: "relative",
      }}>
        <div style={{
          width: "100%", height: "100%", borderRadius: "50%",
          background: exhausted
            ? "radial-gradient(circle at 50% 35%, #1a1420 0%, #0b0510 78%)"
            : `radial-gradient(circle at 50% 35%, ${hexToRgba(rColor, 0.35)} 0%, #0b0510 78%)`,
          border: "1.5px solid #0b0510",
          boxShadow: "inset 0 0 5px rgba(0,0,0,0.75)",
          display: "grid", placeItems: "center", overflow: "hidden",
        }}>
          <img src={assetUrlFromJson(src)} alt="" style={{ width: "82%", imageRendering: "pixelated", filter: exhausted ? "grayscale(1) brightness(0.55)" : "drop-shadow(0 1px 2px rgba(0,0,0,0.8))" }} />
          {resting && <span style={{ position: "absolute", top: -2, right: -2, fontSize: 11, filter: "drop-shadow(0 0 3px #4a9eff)" }}>🏡</span>}
          {exhausted && <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 15, textShadow: "0 0 4px #000" }}>🔒</span>}
        </div>
      </div>


      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
          <span style={{
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: 11.5, fontWeight: 900, letterSpacing: 0.5,
            color: rColor,
            textShadow: "0 1px 0 #000",
          }}>{pet.species.replace(/_/g, " ").toUpperCase()}</span>
          <span style={{
            fontSize: 9, fontWeight: 900, letterSpacing: 0.5,
            padding: "1px 6px", borderRadius: 999,
            background: "linear-gradient(180deg, #ffd66b, #b8862a)", color: "#2a1a0a",
            border: "1px solid rgba(0,0,0,0.4)",
          }}>LV {pet.level}</span>
        </div>
        {/* HP */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
          <span style={{ fontSize: 9, color: "#ff9d9d", width: 10 }}>❤</span>
          <div style={{
            flex: 1, height: 6, background: "#1a0808", borderRadius: 3,
            border: "1px solid #3a1010", overflow: "hidden",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)",
          }}>
            <div style={{
              width: `${pct}%`, height: "100%",
              background: pct > 40 ? "linear-gradient(180deg, #a7f3a0, #3ea854)" : "linear-gradient(180deg, #ff9d9d, #a83030)",
              boxShadow: pct > 40 ? "0 0 5px #5ec26a88" : "0 0 5px #e34a4a88",
            }} />
          </div>
          <span style={{ fontSize: 8.5, color: "#f0d0d0", fontWeight: 700, minWidth: 44, textAlign: "right", fontFamily: "monospace" }}>{hp}/{maxHp}</span>
        </div>
        {/* Energia */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
          <span style={{ fontSize: 9, color: "#8fd0ff", width: 10 }}>⚡</span>
          <div style={{
            flex: 1, height: 4, background: "#08131f", borderRadius: 2,
            border: "1px solid #0e2438", overflow: "hidden",
          }}>
            <div style={{
              width: `${infinite ? 100 : ePct}%`, height: "100%",
              background: resting ? "linear-gradient(180deg, #a7d8ff, #4a9eff)" : (energy > 30 ? "linear-gradient(180deg, #8fd0ff, #2a6ec9)" : "linear-gradient(180deg, #ffb37a, #d95a1e)"),
            }} />
          </div>
          <span style={{ fontSize: 8.5, color: "#a5c8ff", minWidth: 30, textAlign: "right", fontWeight: 700 }}>
            {infinite ? "∞" : `${energy}%`}
          </span>
        </div>
      </div>
    </div>
  );
}


function ProgressRow({ icon, label, value, target }: { icon: string; label: string; value: number; target: number }) {
  const pct = Math.min(100, (value / target) * 100);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
        <span>{icon} {label}</span>
        <span style={{ color: "#f5cf6b" }}>{value}/{target}</span>
      </div>
      <div style={{ height: 5, background: "#3a1010", borderRadius: 2 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#5ec26a", borderRadius: 2 }} />
      </div>
    </div>
  );
}

// HUD topo — chip elegante para moeda/cristal
function HudChip({ color, label, icon }: { color: string; label: string; icon: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: `linear-gradient(180deg, ${color}22, ${color}08)`,
      border: `1px solid ${color}66`,
      padding: "3px 8px", borderRadius: 6,
      color, fontWeight: 800, textShadow: "1px 1px 0 #000",
    }}>
      <span>{icon}</span><span>{label}</span>
    </span>
  );
}
function HudBall({ img, count, color }: { img: any; count: number; color: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      opacity: count > 0 ? 1 : 0.5,
    }} title={`${count}`}>
      <img src={assetUrlFromJson(img)} alt="" width={20} height={20}
        style={{ imageRendering: "pixelated", filter: `drop-shadow(0 0 4px ${color}88)` }} />
      <span style={{ color: "#eadfe8", fontWeight: 800, textShadow: "1px 1px 0 #000" }}>x{count}</span>
    </span>
  );
}

// ── Pill de status do perfil de treinador
function pillStyle(color: string): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: 3,
    padding: "2px 7px", borderRadius: 999,
    background: `linear-gradient(180deg, ${color}22, rgba(0,0,0,0.4))`,
    border: `1px solid ${color}66`,
    color, fontSize: 10, fontWeight: 900, letterSpacing: 0.3,
    textShadow: "0 1px 0 #000", whiteSpace: "nowrap",
  };
}



// ── HUD superior: nicho clássico para OURO / CRISTAIS
function ResourceNiche({ tint, icon, value, title }: { tint: string; icon: React.ReactNode; value: string; title: string }) {
  return (
    <div title={title} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 10px",
      background: `linear-gradient(180deg, ${tint}22, rgba(0,0,0,0.35))`,
      borderLeft: "1px solid rgba(245,207,107,0.25)",
      borderRight: "1px solid rgba(245,207,107,0.25)",
      boxShadow: `inset 0 0 10px ${tint}18`,
    }}>
      {icon}
      <span style={{
        color: tint, fontWeight: 900, fontSize: 12.5,
        textShadow: "0 1px 0 #000",
        fontFamily: "'Cinzel', Georgia, serif", letterSpacing: 0.4,
      }}>{value}</span>
    </div>
  );
}

// ── HUD superior: slot elegante para cada Pokébola
function BallSlot({ img, count, tint }: { img: any; count: number; tint: string }) {
  const empty = count <= 0;
  return (
    <div style={{
      position: "relative",
      width: 34, height: 34,
      margin: "0 6px",
      display: "grid", placeItems: "center",
      opacity: empty ? 0.5 : 1,
      transition: "transform 120ms ease",
    }}>
      {/* halo colorido externo */}
      {!empty && (
        <span style={{
          position: "absolute", inset: -3, borderRadius: "50%",
          background: `radial-gradient(circle, ${tint}77 0%, transparent 65%)`,
          filter: "blur(2px)", pointerEvents: "none",
        }} />
      )}
      {/* moldura dourada circular */}
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: empty
          ? "conic-gradient(from 45deg, #5a4a3a, #2a1a10, #4a3a2a, #5a4a3a)"
          : "conic-gradient(from 45deg, #ffe89a, #b8862a, #6b3d0a, #ffd66b, #ffe89a)",
        padding: 1.5,
        boxShadow: empty
          ? "0 1px 2px rgba(0,0,0,0.6), inset 0 0 3px rgba(0,0,0,0.6)"
          : `0 2px 4px rgba(0,0,0,0.7), inset 0 0 3px rgba(0,0,0,0.6), 0 0 8px ${tint}aa`,
      }}>
        <span style={{
          display: "block", width: "100%", height: "100%", borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, ${empty ? "#1a121a" : tint + "55"} 0%, #0b0510 78%)`,
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.7)",
        }} />
      </span>
      {/* pokébola */}
      <img
        src={assetUrlFromJson(img)}
        alt=""
        width={24}
        height={24}
        style={{
          position: "relative", zIndex: 2,
          imageRendering: "pixelated",
          filter: empty
            ? "grayscale(0.85) brightness(0.6)"
            : `drop-shadow(0 0 3px ${tint}) drop-shadow(0 1px 1px rgba(0,0,0,0.9))`,
        }}
      />
      {/* contador — tabuleta pendurada */}
      <span style={{
        position: "absolute", bottom: -7, right: -9, zIndex: 3,
        minWidth: 22, height: 15, padding: "0 5px",
        background: empty
          ? "linear-gradient(180deg, #3a2a3a, #1a121a)"
          : "linear-gradient(180deg, #1a1220 0%, #0b0510 100%)",
        color: empty ? "#8a7a9c" : "#ffe89a",
        fontSize: 10, fontWeight: 900, letterSpacing: 0.3,
        fontFamily: "'Cinzel', Georgia, serif",
        border: `1px solid ${empty ? "#4a3a4a" : "#c48e2a"}`,
        borderRadius: 8,
        display: "grid", placeItems: "center",
        boxShadow: "0 2px 3px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
        lineHeight: 1,
      }}>{count}</span>
    </div>
  );
}


// ============ estilos ============
const smallBtn: React.CSSProperties = {
  background: "#2a1a3a", color: "#f3e5c5",
  border: "1px solid rgba(245,207,107,0.2)",
  padding: "6px 10px", borderRadius: 6, cursor: "pointer",
  fontSize: 11, fontWeight: 600,
};
const collectBtn: React.CSSProperties = {
  width: "100%", background: "linear-gradient(180deg, #f5cf6b, #d4a439)",
  color: "#3d2b0a", fontWeight: 800, letterSpacing: 1,
  border: "none", padding: "10px", borderRadius: 6, cursor: "pointer", fontSize: 13,
};
const pillBtn: React.CSSProperties = {
  display: "inline-block", background: "#c92a2a", color: "#fff",
  padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700,
  textDecoration: "none", boxShadow: "0 2px 8px rgba(201,42,42,0.4)",
};
const zoomBtn: React.CSSProperties = {
  width: 32, height: 28, background: "rgba(20,10,30,0.85)", color: "#f5cf6b",
  border: "1px solid rgba(245,207,107,0.4)", borderRadius: 6, cursor: "pointer",
  fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
  padding: 0, lineHeight: 1,
};

// Widget de compra com quantidade: presets + input custom + botão comprar.
function QtyBuy({ presets, max, unitLabel, buttonColor, canBuyFn, onBuy, disabledLabel = "SEM RECURSO" }:
  { presets: number[]; max: number; unitLabel: string; buttonColor: string; canBuyFn: (n: number) => boolean; onBuy: (n: number) => void; disabledLabel?: string }) {
  const [qty, setQty] = useState<number>(1);
  const clamp = (v: number) => Math.max(1, Math.min(Math.max(1, max), Math.floor(v || 1)));
  const q = clamp(qty);
  const ok = canBuyFn(q);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
        {presets.map((p) => (
          <button key={p} onClick={() => setQty(p)} style={{
            padding: "3px 8px", fontSize: 11, fontWeight: 800, borderRadius: 5,
            border: `1px solid ${qty === p ? buttonColor : "#4a3a52"}`,
            background: qty === p ? `${buttonColor}22` : "#1a0f26",
            color: qty === p ? buttonColor : "#b8a8c8", cursor: "pointer",
          }}>×{p}</button>
        ))}
        <button onClick={() => setQty(clamp(Math.max(...presets)))} style={{
          padding: "3px 8px", fontSize: 11, fontWeight: 800, borderRadius: 5,
          border: `1px solid #4a3a52`, background: "#1a0f26", color: "#b8a8c8", cursor: "pointer",
        }}>MAX</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button onClick={() => setQty(clamp(q - 1))} style={{ width: 28, height: 30, background: "#2a1a3a", border: "1px solid #4a3a52", color: "#eadfe8", borderRadius: 5, cursor: "pointer", fontWeight: 900 }}>−</button>
        <input type="number" min={1} max={max} value={qty}
          onChange={(e) => setQty(clamp(parseInt(e.target.value, 10)))}
          style={{ flex: 1, height: 30, textAlign: "center", background: "#0f0819", border: "1px solid #4a3a52", color: "#eadfe8", borderRadius: 5, fontWeight: 800, fontSize: 13 }} />
        <button onClick={() => setQty(clamp(q + 1))} style={{ width: 28, height: 30, background: "#2a1a3a", border: "1px solid #4a3a52", color: "#eadfe8", borderRadius: 5, cursor: "pointer", fontWeight: 900 }}>+</button>
      </div>
      <button onClick={() => ok && onBuy(q)} disabled={!ok} style={{
        width: "100%", padding: "8px 10px", fontWeight: 800, fontSize: 12,
        background: ok ? buttonColor : "#3a2a4a", color: ok ? "#0b0510" : "#6a5a7c",
        border: "none", borderRadius: 6, cursor: ok ? "pointer" : "not-allowed",
      }}>{ok ? `COMPRAR ×${q} ${unitLabel}` : disabledLabel}</button>
    </div>
  );
}

// ============ Overlay das abas ============
function TabOverlay({
  tab, onClose, leader, team, onReorderTeam, leaderHp, items, caughtSpecies, seenSpecies, totals, collection, craftPoints, onFragmentCollection, gifMap, onPickTeam, onUseItem,
  bank, buffs, onBuyBall, onBuyUltraBundle, onBuyTeleportScroll, onBuyBook, onBuyPotion, onBuyEgg, shopEggs, onBuyChestAmulet, chestAmuletOwned, autoHeal, setAutoHeal, audioSettings, setAudioSettings,
  tasks, onClaimTask, onOpenColecaoDetail, onExchange, onSellItem, marketSellPrices, identity, onListMarket, onBuyMarket, onCancelMarket, onClaimMarketPayout, isVip, skinId, setSkinId, unlockedSkins, skinTickets, onUnlockSkin, trainerLevel, onUpgradeBook, orbTrades, onTradeOrb, pokemonMarketNode, benchUids,
  idle, setIdle, pushChat


}: {
  tab: string;
  onClose: () => void;
  leader: PetInstance | undefined;
  team: PetInstance[];
  onReorderTeam: (next: PetInstance[]) => void;
  leaderHp: number;
  items: Record<string, number>;
  caughtSpecies: Species[];
  seenSpecies: Species[];
  totals: { gold: number; captured: number };
  collection: CollectionEntry[];
  craftPoints: number;
  onFragmentCollection: (uid: string) => void;
  gifMap: Partial<Record<Species, string>>;
  onPickTeam: (entry: CollectionEntry) => void;
  onUseItem: (id: string, qty?: number) => void;
  bank: { gold: number; crystals: number };
  buffs: { atk: number; def: number; expMult: number; expMultUntil?: number; goldMult?: number; goldMultUntil?: number; orbMult?: number; orbUntil?: number; orbId?: string; honeyUntil?: number; honeyRareUntil?: number; teamOrbUntil?: number };
  onBuyBall: (b: ShopBall, qty?: number) => void;
  onBuyUltraBundle: (qty?: number) => void;
  onBuyTeleportScroll: (qty?: number) => void;
  onBuyBook: (bk: ShopBook, qty?: number) => void;
  onBuyPotion: (qty?: number) => void;
  onBuyEgg: (e: { id: "egg_common" | "egg_rare" | "egg_epic" | "egg_mystic" | "egg_aura" | "egg_charizard" | "egg_lugia" | "egg_dragonite"; name: string; price: number; currency: "gold" | "crystals"; desc: string; color: string }) => void;
  shopEggs: { id: "egg_common" | "egg_rare" | "egg_epic" | "egg_mystic" | "egg_aura" | "egg_charizard" | "egg_lugia" | "egg_dragonite"; name: string; price: number; currency: "gold" | "crystals"; desc: string; color: string }[];

  onBuyChestAmulet: () => void;

  chestAmuletOwned: number;
  autoHeal: { enabled: boolean; threshold: number };
  setAutoHeal: (next: { enabled: boolean; threshold: number }) => void;
  audioSettings: { music: boolean; sfx: boolean; musicVol: number; sfxVol: number };
  setAudioSettings: React.Dispatch<React.SetStateAction<{ music: boolean; sfx: boolean; musicVol: number; sfxVol: number }>>;
  tasks: Task[];
  onClaimTask: (tid: string) => void;
  onOpenColecaoDetail: (uid: string) => void;
  onExchange: (dir: "g2c" | "c2g", amount: number) => void;
  onSellItem: (id: string, qty?: number, currency?: "gold" | "crystal" | "safira") => void;
  marketSellPrices: Record<string, number>;
  identity: LocalIdentity | null;
  onListMarket: (itemId: string, qty: number, price: number, currency?: "gold" | "crystal" | "safira") => Promise<boolean>;
  onBuyMarket: (l: { id: string; seller_id: string; item_id: string; qty: number; price: number; currency?: "gold" | "crystal" | "safira" }) => Promise<boolean>;
  onCancelMarket: (l: { id: string; item_id: string; qty: number; seller_id: string }) => Promise<boolean>;
  onClaimMarketPayout: (l: { id: string; item_id: string; qty: number; price: number; currency?: "gold" | "crystal" | "safira" }) => Promise<boolean>;

  isVip: boolean;
  skinId: string;
  setSkinId: (id: string) => void;
  trainerLevel: number;
  unlockedSkins: string[];
  skinTickets: number;
  onUnlockSkin: (id: string) => void;
  onUpgradeBook: (id: string) => void;
  orbTrades: { orbId: "orb_xp_minor" | "orb_xp_major" | "orb_xp_supreme" | "orb_team"; label: string; rarity: Rarity; count: number; color: string; img: any; desc: string; baseSuccess: number; upgradeTo?: "orb_xp_minor" | "orb_xp_major" | "orb_xp_supreme" | "orb_team"; requires?: { itemId: string; qty: number; label: string } }[];
  onTradeOrb: (orbId: "orb_xp_minor" | "orb_xp_major" | "orb_xp_supreme" | "orb_team", uids: string[], fuelUids: string[], rarity?: Rarity) => void;
  pokemonMarketNode?: React.ReactNode;
  benchUids: Set<string>;
  idle: any;
  setIdle: React.Dispatch<React.SetStateAction<any>>;
  pushChat: (msg: string, tone?: any) => void;

}) {


  const title =
    tab === "pokemon"   ? "MEU POKÉMON" :
    tab === "mochila"   ? "MOCHILA" :
    tab === "colecao"   ? "COLEÇÃO" :
    tab === "pokedex"   ? "POKÉDEX" :
    tab === "loja"      ? "LOJA" :
    tab === "wallet"    ? "BANCO MEDIEVAL" :
    tab === "market"    ? "MERCADO BLOQUEADO" :

    tab === "melhorias" ? "MELHORIAS" :
    tab === "config"    ? "CONFIGURAÇÕES" :
    tab === "tarefas"   ? "TAREFAS" :
    tab === "inicio"    ? "INÍCIO" : "";
  const [mochilaCat, setMochilaCat] = useState<"all" | "balls" | "potions" | "books" | "eggs" | "other">("all");
  const [itemDetail, setItemDetail] = useState<string | null>(null);
  const [orbPicker, setOrbPicker] = useState<null | { orbId: "orb_xp_minor" | "orb_xp_major" | "orb_xp_supreme" | "orb_team"; rarity: Rarity; count: number; color: string; label: string }>(null);
  const [orbPickerSel, setOrbPickerSel] = useState<Set<string>>(new Set());
  const [statsCardPet, setStatsCardPet] = useState<PetInstance | null>(null);
  // Coleção: filtros + cadeado (persistidos em localStorage)
  const LOCK_KEY = "rubym.colecao.locked.v1";
  const [lockedSet, setLockedSet] = useState<Set<string>>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(LOCK_KEY) : null;
      if (!raw) return new Set<string>();
      return new Set(JSON.parse(raw) as string[]);
    } catch { return new Set<string>(); }
  });
  const toggleLock = (uid: string) => {
    setLockedSet((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid); else next.add(uid);
      try { localStorage.setItem(LOCK_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };
  const [colFilterRarity, setColFilterRarity] = useState<"all" | Rarity>("all");
  const [colFilterName, setColFilterName] = useState("");
  const [colSort, setColSort] = useState<"recent" | "level_desc" | "level_asc" | "rarity" | "name">("recent");
  const [colOnlyLocked, setColOnlyLocked] = useState(false);
  // Fragmentar: modo bulk + modal de confirmação bonito
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSel, setBulkSel] = useState<Set<string>>(new Set());
  const [fragConfirm, setFragConfirm] = useState<null | {
    entries: Array<{ uid: string; species: Species; level: number; rarity: Rarity; gain: number }>;
    totalGain: number;
  }>(null);
  const teamUidSet = useMemo(() => new Set(team.map((p) => p.uid)), [team]);
  const toggleBulk = (uid: string) => {
    setBulkSel((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid); else next.add(uid);
      return next;
    });
  };
  const openFragConfirm = (uids: string[]) => {
    const entries = uids
      .map((uid) => collection.find((e) => e.uid === uid))
      .filter((e): e is CollectionEntry => !!e)
      .filter((e) => !teamUidSet.has(e.uid) && !lockedSet.has(e.uid))
      .map((e) => ({ uid: e.uid, species: e.species, level: e.level, rarity: e.rarity, gain: CRAFT_BY_RARITY[e.rarity] ?? 1 }));
    if (entries.length === 0) return;
    const totalGain = entries.reduce((s, e) => s + e.gain, 0);
    setFragConfirm({ entries, totalGain });
  };
  const confirmFrag = () => {
    if (!fragConfirm) return;
    fragConfirm.entries.forEach((e) => onFragmentCollection(e.uid));
    setBulkSel(new Set());
    setBulkMode(false);
    setFragConfirm(null);
  };
  return (
    <div style={{
      position: "absolute", inset: 12, background: "rgba(11,5,16,0.96)",
      border: "1px solid rgba(245,207,107,0.3)", borderRadius: 12,
      zIndex: 20, padding: 16, overflowY: "auto",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, color: "#f5cf6b" }}>{title}</h2>
        <button onClick={onClose} style={{ ...smallBtn, background: "#c92a2a", color: "#fff", border: "none", padding: "6px 14px" }}>
          ← Voltar
        </button>
      </div>

      <>
      {tab === "pokemon" && leader && (
        <div style={{
          position: "relative",
          padding: "14px 12px 18px",
          borderRadius: 18,
          border: "3px solid #6b3fa0",
          background: `linear-gradient(180deg, rgba(20,10,35,0.82) 0%, rgba(30,15,50,0.9) 45%, rgba(20,10,35,0.95) 100%), url(${assetUrlFromJson(pokemonTabBg)}) center/cover no-repeat`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.55), inset 0 0 40px rgba(192,132,252,0.15), 0 0 22px rgba(192,132,252,0.25)",
          overflow: "hidden",
        }}>
          {/* decorative sparkles overlay */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(circle at 12% 10%, rgba(255,151,225,0.18), transparent 45%), radial-gradient(circle at 88% 90%, rgba(192,132,252,0.18), transparent 45%)",
          }} />
          <div style={{
            position: "absolute", top: 8, right: 14,
            fontSize: 10, fontWeight: 900, letterSpacing: 3,
            color: "#ff97e1", textShadow: "0 0 8px rgba(255,151,225,0.7)",
            opacity: 0.85,
          }}>✦ MEW ✦</div>
          <div style={{ position: "relative" }}>
          <PokemonDetail pet={leader} currentHp={leaderHp} src={assetUrlFromJson(gifMap[leader.species])} />
          <ActiveBonuses leaderRarity={leader.rarity} team={team} buffs={buffs} idle={idle} />
          <SpeciesLore species={leader.species} rarity={leader.rarity} />


          {(() => {
            const RARITY_COLORS: Record<string, { c: string; label: string }> = {
              common:       { c: "#c8b8d0", label: "COMUM" },
              uncommon:     { c: "#7ef2a2", label: "INCOMUM" },
              rare:         { c: "#6bd4ff", label: "RARO" },
              epic:         { c: "#c084fc", label: "ÉPICO" },
              legendary:    { c: "#f5cf6b", label: "LENDÁRIO" },
              mythic:       { c: "#ff6b3d", label: "MÍTICO" },
              mythic_shiny: { c: "#ff97e1", label: "MÍTICO ✦" },
            };
            return (
              <div style={{
                marginTop: 18,
                padding: "14px 16px",
                background: "linear-gradient(135deg, #2a1638 0%, #1a0f26 50%, #251638 100%)",
                border: "3px solid #f5cf6b",
                borderRadius: 16,
                boxShadow: "0 6px 22px rgba(0,0,0,0.55), inset 0 1px 0 rgba(245,207,107,0.4), 0 0 24px rgba(245,207,107,0.12)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 15% 20%, rgba(245,207,107,0.15), transparent 60%)", pointerEvents: "none" }} />
                {/* Header do time */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, position: "relative" }}>
                  <div>
                    <div style={{ color: "#f5cf6b", fontSize: 18, fontWeight: 900, letterSpacing: 2, textShadow: "0 2px 0 #0b0510, 0 0 10px rgba(245,207,107,0.6)" }}>
                      ⚔ SEU TIME ⚔
                    </div>
                    <div style={{ color: "#b8a8c8", fontSize: 10, marginTop: 2, letterSpacing: 1 }}>
                      Ordene por prioridade — o Líder é o #1
                    </div>
                  </div>
                  <div style={{
                    background: "rgba(245,207,107,0.15)", border: "1px solid rgba(245,207,107,0.4)",
                    padding: "4px 12px", borderRadius: 999, color: "#f5cf6b",
                    fontSize: 12, fontWeight: 900, letterSpacing: 1,
                  }}>{team.length}/6</div>
                </div>

                <SynergyPanel team={team} />



                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, position: "relative" }}>
                  {team.map((p, i) => {
                    const src = gifMap[p.species];
                    const isLeader = i === 0;
                    const rarityInfo = RARITY_COLORS[p.rarity] ?? RARITY_COLORS.common;
                    const rc = rarityInfo.c;
                    const petMax = calcIdleMaxHp(p);
                    const petHp = isLeader ? leaderHp : (p.hp ?? petMax);
                    const hpPct = Math.max(0, Math.min(100, (petHp / petMax) * 100));
                    const hpColor = hpPct > 55 ? "#5ec26a" : hpPct > 25 ? "#f5cf6b" : "#ff5252";
                    const move = (from: number, to: number) => {
                      if (to < 0 || to >= team.length) return;
                      const arr = [...team];
                      const [x] = arr.splice(from, 1);
                      arr.splice(to, 0, x);
                      onReorderTeam(arr);
                    };
                    // Stats RPG derivados de nível + raridade (visual)
                    const rarityBaseMap: Record<string, number> = {
                      common: 42, uncommon: 58, rare: 78, epic: 100, legendary: 130, mythic: 160, mythic_shiny: 200,
                    };
                    const base = rarityBaseMap[p.rarity] ?? 42;
                    const lvl = p.level;
                    const stats = {
                      atk: Math.round(base + lvl * 2.1),
                      def: Math.round(base * 0.85 + lvl * 1.6),
                      spa: Math.round(base + lvl * 1.9),
                      spd: Math.round(base * 0.9 + lvl * 1.7),
                      spe: Math.round(base * 0.8 + lvl * 2.2),
                    };
                    const maxStat = Math.max(stats.atk, stats.def, stats.spa, stats.spd, stats.spe, 1);
                    const StatIcon = ({ kind, col }: { kind: string; col: string }) => {
                      const paths: Record<string, any> = {
                        atk: <div><path d="M4 20 L14 10 M12 8 L20 4 L18 12 L10 10 Z" stroke={col} strokeWidth="2" fill={col+"55"} strokeLinejoin="round"/><circle cx="5" cy="19" r="1.5" fill={col}/></div>,
                        def: <div><path d="M12 3 L20 6 V12 C20 17 16 20 12 21 C8 20 4 17 4 12 V6 Z" stroke={col} strokeWidth="2" fill={col+"55"} strokeLinejoin="round"/><path d="M9 12 L11 14 L15 10" stroke={col} strokeWidth="2" fill="none" strokeLinecap="round"/></div>,
                        spa: <div><path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z" stroke={col} strokeWidth="1.5" fill={col+"77"} strokeLinejoin="round"/></div>,
                        spd: <div><circle cx="12" cy="12" r="8" stroke={col} strokeWidth="2" fill={col+"33"}/><path d="M12 4 Q16 12 12 20 Q8 12 12 4" stroke={col} strokeWidth="1.5" fill={col+"77"}/></div>,
                        spe: <div><path d="M13 3 L4 14 H11 L9 21 L20 10 H13 Z" stroke={col} strokeWidth="1.5" fill={col+"77"} strokeLinejoin="round"/></div>,
                      };
                      return (
                        <svg viewBox="0 0 24 24" width="18" height="18" style={{ filter: `drop-shadow(0 0 3px ${col}aa)` }}>
                          {paths[kind]}
                        </svg>
                      );
                    };
                    const statRow = (kind: string, label: string, val: number, col: string) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 7,
                          background: `radial-gradient(circle at 30% 25%, ${col}66, ${col}22 70%, rgba(0,0,0,0.4))`,
                          border: `1px solid ${col}aa`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                          boxShadow: `0 0 6px ${col}55, inset 0 1px 0 rgba(255,255,255,0.15)`,
                        }}><StatIcon kind={kind} col={col} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, fontWeight: 900, letterSpacing: 1, color: "#c8b8d0", marginBottom: 2 }}>
                            <span>{label}</span>
                            <span style={{ color: col, fontFamily: "monospace", fontSize: 9 }}>{val}</span>
                          </div>
                          <div style={{ height: 4, background: "rgba(0,0,0,0.55)", borderRadius: 3, overflow: "hidden", border: "1px solid rgba(0,0,0,0.7)" }}>
                            <div style={{
                              width: `${(val / maxStat) * 100}%`, height: "100%",
                              background: `linear-gradient(90deg, ${col}, ${col}dd)`,
                              boxShadow: `0 0 4px ${col}88`,
                            }} />
                          </div>
                        </div>
                      </div>
                    );
                    return (
                      <div key={p.uid} style={{
                        display: "flex", alignItems: "stretch", gap: 12, padding: 12,
                        background: isLeader
                          ? `linear-gradient(135deg, ${rc}2a 0%, #1a0f26 45%, #251638 100%)`
                          : "linear-gradient(135deg, rgba(28,16,45,0.92), rgba(38,22,60,0.9))",
                        border: `2.5px solid ${isLeader ? rc : rc + "66"}`,
                        borderRadius: 14,
                        boxShadow: isLeader
                          ? `0 6px 18px rgba(0,0,0,0.55), inset 0 1px 0 ${rc}66, 0 0 22px ${rc}44`
                          : `0 3px 10px rgba(0,0,0,0.5), inset 0 1px 0 ${rc}33`,
                        position: "relative", overflow: "hidden",
                      }}>
                        {/* sparkle overlay */}
                        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 85% 15%, ${rc}22, transparent 55%)`, pointerEvents: "none" }} />

                        {/* Portrait + Level badge */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, position: "relative" }}>
                          <div style={{
                            width: 82, height: 82, borderRadius: 14,
                            background: `radial-gradient(circle at 30% 25%, ${rc}55, ${rc}15 60%, rgba(0,0,0,0.45))`,
                            border: `2px solid ${rc}`,
                            boxShadow: `inset 0 0 14px ${rc}44, 0 3px 10px rgba(0,0,0,0.55), 0 0 12px ${rc}55`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            position: "relative", overflow: "hidden",
                          }}>
                            {src && <img src={assetUrlFromJson(src)} alt="" width={70} height={70} style={{ imageRendering: "pixelated", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.7))" }} />}
                            {/* Slot number top-left */}
                            <div style={{
                              position: "absolute", top: 2, left: 4,
                              fontSize: 10, fontWeight: 900,
                              color: isLeader ? rc : "#8a7a9c",
                              textShadow: "0 1px 2px #000",
                            }}>{isLeader ? "★" : `#${i + 1}`}</div>
                            {/* Level bottom-right badge */}
                            <div style={{
                              position: "absolute", bottom: -4, right: -4,
                              minWidth: 28, height: 22, padding: "0 6px",
                              background: "linear-gradient(180deg, #ffd66b, #b8862a)",
                              color: "#0b0510", border: "2px solid #0b0510",
                              borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 10, fontWeight: 900, letterSpacing: 0.5,
                              boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
                            }}>Lv{p.level}</div>
                          </div>
                          {isLeader && (
                            <div style={{
                              padding: "2px 8px", borderRadius: 999,
                              background: `linear-gradient(180deg, ${rc}, ${rc}bb)`,
                              color: "#0b0510", fontSize: 8, fontWeight: 900, letterSpacing: 1.5,
                              boxShadow: `0 2px 6px ${rc}88`, border: "1px solid #fff4d0",
                            }}>LÍDER</div>
                          )}
                        </div>

                        {/* Info + Stats */}
                        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6, position: "relative" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <div style={{ color: "#f7ecf7", fontWeight: 900, fontSize: 14, textTransform: "uppercase", letterSpacing: 1, textShadow: "0 1px 0 #000" }}>
                              {p.species.replace(/_/g, " ")}
                            </div>
                            <div style={{
                              background: `linear-gradient(180deg, ${rc}, ${rc}aa)`, color: "#0b0510",
                              fontSize: 8, fontWeight: 900, letterSpacing: 1,
                              padding: "2px 7px", borderRadius: 4,
                              boxShadow: `0 0 8px ${rc}88`, border: "1px solid rgba(0,0,0,0.4)",
                            }}>{rarityInfo.label}</div>
                            <button
                              onClick={() => setStatsCardPet(p)}
                              title="Ver ficha completa"
                              style={{
                                marginLeft: "auto", background: "linear-gradient(180deg,#f5cf6b,#b8862a)",
                                color: "#1a0f26", border: "1px solid #0b0510", borderRadius: 6,
                                padding: "2px 8px", fontSize: 9, fontWeight: 900, letterSpacing: 1, cursor: "pointer",
                              }}
                            >⚡ {computePower(p)} • CARD</button>
                          </div>


                          {/* HP */}
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontWeight: 900, letterSpacing: 1, marginBottom: 2 }}>
                              <span style={{ color: "#ff9ea1" }}>❤ HP</span>
                              <span style={{ color: hpColor, fontFamily: "monospace" }}>{Math.floor(petHp)}/{petMax}</span>
                            </div>
                            <div style={{
                              height: 9, background: "rgba(0,0,0,0.6)",
                              border: "1px solid rgba(0,0,0,0.75)",
                              borderRadius: 4, overflow: "hidden",
                              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)",
                            }}>
                              <div style={{
                                width: `${hpPct}%`, height: "100%",
                                background: `linear-gradient(180deg, ${hpColor}, ${hpColor}aa)`,
                                boxShadow: `0 0 6px ${hpColor}88, inset 0 1px 0 rgba(255,255,255,0.4)`,
                                transition: "width 200ms",
                              }} />
                            </div>
                          </div>

                          {/* Stats grid */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 2 }}>
                            {statRow("atk", "ATK", stats.atk, "#ff7a7a")}
                            {statRow("def", "DEF", stats.def, "#7ec4ff")}
                            {statRow("spa", "S.ATK", stats.spa, "#c084fc")}
                            {statRow("spd", "S.DEF", stats.spd, "#7ef2a2")}
                            {statRow("spe", "VEL", stats.spe, "#f5cf6b")}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center", flexShrink: 0, position: "relative" }}>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button onClick={() => move(i, i - 1)} disabled={i === 0}
                              title="Subir"
                              style={{
                                width: 26, height: 22, fontSize: 12, fontWeight: 900,
                                background: i === 0 ? "#2a1638" : "linear-gradient(180deg, #3a2450, #241634)",
                                color: i === 0 ? "#4a3560" : "#eadfe8",
                                border: `1px solid ${i === 0 ? "#3a2450" : "#5a3d78"}`,
                                borderRadius: 5, cursor: i === 0 ? "not-allowed" : "pointer",
                              }}>▲</button>
                            <button onClick={() => move(i, i + 1)} disabled={i === team.length - 1}
                              title="Descer"
                              style={{
                                width: 26, height: 22, fontSize: 12, fontWeight: 900,
                                background: i === team.length - 1 ? "#2a1638" : "linear-gradient(180deg, #3a2450, #241634)",
                                color: i === team.length - 1 ? "#4a3560" : "#eadfe8",
                                border: `1px solid ${i === team.length - 1 ? "#3a2450" : "#5a3d78"}`,
                                borderRadius: 5, cursor: i === team.length - 1 ? "not-allowed" : "pointer",
                              }}>▼</button>
                          </div>
                          {!isLeader && (
                            <button onClick={() => move(i, 0)}
                              title="Tornar Líder"
                              style={{
                                padding: "3px 8px", fontSize: 9, fontWeight: 900, letterSpacing: 0.5,
                                background: "linear-gradient(180deg, #ffd66b, #b8862a)",
                                color: "#0b0510", border: "1px solid #fff4d0",
                                borderRadius: 5, cursor: "pointer",
                                boxShadow: "0 2px 4px rgba(184,134,42,0.55)",
                              }}>★ LÍDER</button>
                          )}
                          <button
                            onClick={() => {
                              if (!confirm(`Retirar ${p.species.replace(/_/g, " ")} do time? Ele continua na Coleção.`)) return;
                              const next = team.filter((x) => x.uid !== p.uid);
                              onReorderTeam(next);
                            }}
                            title="Retirar do time (fica na Coleção)"
                            style={{
                              padding: "3px 8px", fontSize: 9, fontWeight: 900, letterSpacing: 0.5,
                              background: "linear-gradient(180deg, #ff7a7a, #8a1a1a)",
                              color: "#fff", border: "1px solid #ffb8b8",
                              borderRadius: 5, cursor: "pointer",
                              boxShadow: "0 2px 4px rgba(138,26,26,0.55)",
                            }}>↩ RETIRAR</button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Slots vazios */}
                  {Array.from({ length: Math.max(0, 6 - team.length) }).map((_, k) => (
                    <div key={`empty-${k}`} style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: 14, minHeight: 60,
                      background: "rgba(20,10,35,0.4)",
                      border: "2px dashed #4a3560", borderRadius: 12,
                      color: "#6a5a7c", fontSize: 11, fontWeight: 800, letterSpacing: 1,
                    }}>
                      <span style={{ fontSize: 16, opacity: 0.5 }}>＋</span>
                      SLOT VAZIO — Adicione pela Coleção
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          </div>
      )}





      {tab === "tarefas" && (
        <div>
          <div style={{ color: "#c8b8d0", fontSize: 13, marginBottom: 12 }}>
            Complete as tarefas para ganhar <img src={assetUrlFromJson(crystalGreenImg)} alt="" style={{ width: 12, verticalAlign: "middle" }} /> cristais.
          </div>
          {tasks.length === 0 ? (
            <div style={{ color: "#8a7a9c", fontSize: 13, padding: 20, textAlign: "center" }}>
              Todas as tarefas foram concluídas! Aguarde novas em breve.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tasks.map((t) => (
                <div key={t.id} style={{
                  background: "linear-gradient(160deg, #1a0f26 0%, #251638 100%)",
                  border: `1px solid ${t.done ? "#5ec26a55" : "rgba(245,207,107,0.2)"}`,
                  borderRadius: 8, padding: 12,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: "#eadfe8", fontWeight: 700, fontSize: 13 }}>{t.title}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#f5cf6b", fontWeight: 800 }}>
                      <img src={assetUrlFromJson(crystalGreenImg)} alt="" style={{ width: 14, imageRendering: "pixelated" }} />
                      {t.reward}
                    </span>
                  </div>
                  <div style={{ height: 6, background: "#3a1010", borderRadius: 3 }}>
                    <div style={{
                      width: `${Math.min(100, (t.progress / t.target) * 100)}%`,
                      height: "100%", background: t.done ? "#5ec26a" : "#c92a2a",
                      borderRadius: 3, transition: "width 200ms",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                    <span style={{ color: "#b8a8c8", fontSize: 11 }}>{t.progress}/{t.target}</span>
                    {t.done && (
                      <button onClick={() => onClaimTask(t.id)}
                        style={{ background: "#5ec26a", color: "#0b0510", border: "none", borderRadius: 6, padding: "6px 14px", fontWeight: 800, cursor: "pointer" }}>
                        COLETAR
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "mochila" && (() => {
        const NAMES: Record<string, string> = {
          potion: "Poção", pokeball: "Pokébola", greatball: "Great Ball", ultraball: "Ultra Ball",
          book_atk: "Livro Ataque", book_def: "Livro Defesa", book_exp: "Livro EXP",
          book_exp_big: "Livro EXP Raro", book_exp_max: "Livro EXP Lendário", book_vip: "Livro VIP ✦",
          book_vip_30: "Livro VIP 30d ✦✦", book_vip_60: "Livro VIP 60d ✦✦✦",
          chest_amulet: "Amuleto do Baú", berry: "Baga", revive: "Reviver", key: "Chave",
          premium_box: "Caixa Premium ✦ Evento",
          skin_ticket: "Ticket de Skin ✦",
          bau_esmeralda: "Baú de Esmeralda 💠",
          chave_ruby: "Chave Ruby 🔴",
          egg_common: "Ovo Comum", egg_rare: "Ovo Raro", egg_epic: "Ovo Épico", egg_mystic: "Ovo Místico", egg_aura: "Ovo da Aura", egg_charizard: "Ovo do Charizard", egg_lugia: "Ovo de Lugia ✦",
          incenso_mel: "Incenso de Mel 🍯", incenso_mel_raro: "Incenso Raro ✨🍯", incenso_mel_raro_24h: "Incenso Raro 24h ✨🍯",
          orb_xp_supreme_24h: "Orb Supremo 24h ✦✦✦",
          safira_verde: "Safira Verde 💚",
          carta_governante: "Carta do Governante 👑",
          carta_incubadora: "Carta da Incubadora Lendária 🔮",
          carta_plus: "Carta Suprema Plus ✦",
          carta_riolu: "Carta Riolu Suprema 🐺✦",
          stone_grass: "Stone Verdejante 🌿", stone_fire: "Stone Ígnea 🔥",
          stone_water: "Stone Aquática 💧", stone_electric: "Stone Elétrica ⚡",
          stone_dark: "Stone Sombria 🌑", stone_dragon: "Stone Dragão 🐉",
          black_mitic_egg: "Black Mitic Egg ✦",
          egg_boost_69: "Cristal do Despertar ✦",
          stone_pack_all: "Pacote das Seis Stones 💠",
        };
        const ITEM_DESC: Record<string, string> = {
          potion: "Restaura HP do pokémon líder. Use em quantidade para curar grandes danos.",
          pokeball: "Pokébola padrão. Chance base de captura.",
          greatball: "Great Ball. Melhor chance de captura contra pokémon fortes.",
          ultraball: "Ultra Ball. Alta chance de captura, essencial contra míticos.",
          book_atk: "Aumenta o Ataque do time em batalha (permanente ao usar).",
          book_def: "Aumenta a Defesa do time em batalha (permanente ao usar).",
          book_exp: "Livro de EXP · +10% EXP por 1 hora.",
          book_exp_big: "Livro de EXP Raro · +20% EXP por 1 hora.",
          book_exp_max: "Livro de EXP Lendário · +30% EXP por 1 hora.",
          book_vip: "Livro VIP · +20% Ouro e EXP por 1 hora.",
          book_vip_30: "Livro VIP 30 dias · +30% Ouro e EXP.",
          book_vip_60: "Livro VIP 60 dias · +40% Ouro e EXP.",
          orb_xp_minor: "Orb Menor ✦ · +10% EXP por 1 hora (stack com livro).",
          orb_xp_major: "Orb Maior ✦✦ · +20% EXP por 1 hora (stack com livro).",
          orb_xp_supreme: "Orb Supremo ✦✦✦ · +30% EXP por 1 hora (stack com livro).",
          orb_xp_supreme_24h: "Orb Supremo 24h ✦✦✦ · +30% EXP por 24 horas contínuas. Não empilha com outro orb ativo.",
          orb_team: "Orb de Time ✦✦✦ · distribui EXP a todo o time por 3 horas.",
          incenso_mel: "Incenso de Mel 🍯 · +10% drop/xp/def/velocidade por 1 hora.",
          incenso_mel_raro: "Incenso Raro ✨🍯 · +20% drop/xp/def/velocidade por 1 hora.",
          incenso_mel_raro_24h: "Incenso Raro 24h ✨🍯 · +20% drop/xp/def/velocidade por 24 horas contínuas.",
          premium_box: "Caixa Premium ✦ Evento · abre para receber 50 Poções, 50 Pokébolas e 1 Ticket de Skin.",
          bau_esmeralda: "Baú de Esmeralda 💠 · loot aleatório de alto valor (balls, orbs, stones, cristais).",
          chave_ruby: "Chave Ruby 🔴 · usada para conversão na Escala Ruby (loja exclusiva). Recompensa do Top 50 do Ranked Global — coletada uma única vez por conta. Top 1: 15 · Top 2: 13 · Top 3: 11 · Top 4: 7 · Top 5–50: 3.",
          skin_ticket: "Ticket de Skin ✦ · use na aba Início para desbloquear uma skin premium.",
          egg_common: "Ovo Comum · chocado gera um pokémon aleatório de raridade baixa.",
          egg_rare: "Ovo Raro · chance de raridades altas ao chocar.",
          egg_epic: "Ovo Épico · alta chance de raridade Épica.",
          egg_mystic: "Ovo Místico · pode chocar espécies míticas.",
          egg_aura: "Ovo da Aura · espécies especiais com aura elemental.",
          egg_charizard: "Ovo do Charizard · choca sempre um Charizard.",
          egg_lugia: "Ovo de Lugia ✦ · choca um Lugia mítico.",
          safira_verde: "Safira Verde 💚 · moeda do evento Oddish. Converte em Esmeraldas (200:1) na Cash Shop.",
          berry: "Baga · restaura um pouco de HP em batalha.",
          revive: "Reviver · devolve um pokémon caído com HP parcial.",
          key: "Chave · abre baús trancados encontrados no mundo.",
          chest_amulet: "Amuleto do Baú · aumenta a chance de baús aparecerem.",
          carta_governante: "Carta do Governante 👑 · libera viagem ao Continente do Governante (Absol). NÃO é consumida — mantenha na mochila para entrar/sair livremente.",
          carta_incubadora: "Carta da Incubadora Lendária 🔮 · entregue ao Governante no Salão para receber 1 Black Mitic Plus Egg (consumida). Limite de 6 ovos simultâneos.",
          carta_plus: "Carta Suprema Plus ✦ · leve ao Governante para materializar 1 Black Mitic Plus direto na Coleção, VERSÁTIL com 6 traits. Uso único.",
          carta_riolu: "Carta Riolu Suprema 🐺✦ · leve ao Governante para materializar 1 Riolu Black Mitic Brilhant Plus (Lv 1000, 6 traits) direto na Coleção. Uso único.",
          stone_grass: "Stone Verdejante 🌿 · alimenta ovos Black Míticos e vale ouro.",
          stone_fire: "Stone Ígnea 🔥 · alimenta ovos Black Míticos e vale ouro.",
          stone_water: "Stone Aquática 💧 · alimenta ovos Black Míticos e vale ouro.",
          stone_electric: "Stone Elétrica ⚡ · alimenta ovos Black Míticos e vale ouro.",
          stone_dark: "Stone Sombria 🌑 · alimenta ovos Black Míticos, valor alto.",
          stone_dragon: "Stone Dragão 🐉 · alimenta ovos Black Míticos, valor muito alto.",
          black_mitic_egg: "Black Mitic Egg ✦ · ovo lendário que flutua ao seu lado. Clique nele no mapa para abrir a HUD e alimentar com Elemental Stones (50 por vez). Cooldown de 7h por alimentação. A afinidade elemental dominante decidirá o elemento do futuro Pokémon.",
          egg_boost_69: "Cristal do Despertar ✦ · use para abrir o painel do Black Mitic Egg e escolher qual ovo terá o progresso adiantado para 69% (só funciona em ovos ativados e com menos de 69%).",
          stone_pack_all: "Pacote das Seis Stones 💠 · use para receber 4 000 de cada Stone Elemental (🌿 🔥 💧 ⚡ 🌑 🐉).",
        };
        const EGG_COLORS: Record<string, string> = { egg_common: "#c8b8d0", egg_rare: "#6bd4ff", egg_epic: "#c084fc", egg_mystic: "#ff97e1", egg_aura: "#6bd4ff", egg_charizard: "#ff6b3d", egg_lugia: "#a9d8ff" };
        const catOf = (id: string): "balls" | "potions" | "books" | "eggs" | "other" => {
          if (id.endsWith("ball") || id === "pokeball" || id === "greatball" || id === "ultraball") return "balls";
          if (id === "potion" || id === "revive" || id === "berry") return "potions";
          if (id.startsWith("book_")) return "books";
          if (id.startsWith("egg_")) return "eggs";
          return "other";
        };
        const CATS: { id: "all" | "balls" | "potions" | "books" | "eggs" | "other"; label: string; icon: string }[] = [
          { id: "all", label: "Tudo", icon: catAllUrl },
          { id: "balls", label: "Bolas", icon: catBallsUrl },
          { id: "potions", label: "Poções", icon: catPotionsUrl },
          { id: "books", label: "Livros", icon: catBooksUrl },
          { id: "eggs", label: "Ovos", icon: catEggsUrl },
          { id: "other", label: "Outros", icon: catOtherUrl },
        ];
        // filtra chaves internas de contagem (não devem aparecer na mochila)
        const entries = Object.entries(items).filter(([id, n]) => n > 0 && !id.startsWith("_"));
        const totalTypes = entries.length;
        const totalCount = entries.reduce((a, [, n]) => a + n, 0);
        const filtered = mochilaCat === "all" ? entries : entries.filter(([id]) => catOf(id) === mochilaCat);
        // slots: preenche a grade com mínimo de 24 slots
        const SLOTS_MIN = 24;
        const emptyCount = Math.max(0, SLOTS_MIN - filtered.length);

        // Paleta obsidiana + violeta arcano — dark fantasy
        const P = {
          bg1: "#1a0d2a", bg2: "#120820", bg3: "#0a0416",
          ink: "#f0e2ff", inkSoft: "#b39dd8",
          gold: "#a855f7", goldLight: "#d4a2ff", goldDark: "#5b21b6",
          rose: "#c026d3", roseSoft: "#e94dea",
          panel: "#1e1030",
        };

        return (
          <div style={{
            background: `
              radial-gradient(circle at 50% 30%, rgba(168,85,247,0.28), transparent 55%),
              url(${assetUrlFromJson(bagBgGlowUrl)}) center/cover no-repeat,
              linear-gradient(160deg, ${P.bg1} 0%, ${P.bg2} 60%, ${P.bg3} 100%)
            `,
            border: `3px solid ${P.gold}`, borderRadius: 16, padding: 14,
            boxShadow: `inset 0 0 0 2px ${P.goldLight}55, inset 0 0 80px rgba(168,85,247,0.22), 0 8px 32px rgba(0,0,0,0.75)`,
            fontFamily: '"Pixelify Sans", ui-monospace, monospace',
            position: "relative",
          }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none",
              background: "radial-gradient(ellipse at 50% 0%, rgba(212,162,255,0.18), transparent 60%)" }} />

            {/* CABEÇALHO — pergaminho dourado */}
            <div style={{
              display: "flex", alignItems: "center", gap: 14, marginBottom: 12,
              padding: "12px 16px",
              background: `linear-gradient(180deg, ${P.panel}, ${P.bg1})`,
              border: `2px solid ${P.goldDark}`, borderRadius: 12,
              boxShadow: `inset 0 0 0 1px ${P.goldLight}, 0 3px 0 rgba(0,0,0,0.15)`,
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: 12, flexShrink: 0,
                background: `radial-gradient(circle at 35% 30%, #fff4d0, ${P.goldLight} 55%, ${P.goldDark})`,
                display: "grid", placeItems: "center",
                border: `2px solid ${P.goldDark}`,
                boxShadow: `inset 0 2px 4px rgba(255,255,255,0.6), 0 3px 8px rgba(0,0,0,0.35)`,
              }}>
                <img src={assetUrlFromJson(bagIconImg)} alt="" width={40} height={40} style={{ imageRendering: "pixelated", filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.4))" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: P.goldDark, fontSize: 22, fontWeight: 900, letterSpacing: 3, lineHeight: 1,
                  textShadow: `0 1px 0 ${P.panel}, 0 2px 3px rgba(0,0,0,0.15)`,
                }}>✦ MOCHILA ✦</div>
                <div style={{ color: P.inkSoft, fontSize: 10.5, marginTop: 6, fontStyle: "italic" }}>
                  "Um bom aventureiro carrega o mundo nas costas."
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
                <div style={{
                  background: `linear-gradient(180deg, ${P.panel}, ${P.bg2})`, color: P.ink,
                  border: `1.5px solid ${P.goldDark}`, borderRadius: 8, padding: "3px 10px",
                  fontSize: 10.5, fontWeight: 900, letterSpacing: 0.5,
                  boxShadow: `inset 0 0 0 1px ${P.goldLight}80`,
                }}>{totalTypes} tipos · {totalCount} itens</div>
                <div style={{ display: "flex", gap: 5 }}>
                  <div style={{
                    background: `linear-gradient(180deg, ${P.goldLight}, ${P.gold})`, color: P.ink,
                    border: `1.5px solid ${P.goldDark}`, borderRadius: 8, padding: "3px 10px",
                    fontSize: 11, fontWeight: 900,
                    boxShadow: "0 2px 0 rgba(0,0,0,0.2)",
                  }}>💰 {bank.gold.toLocaleString()}</div>
                  <div style={{
                    background: "linear-gradient(180deg, #c084fc, #9333ea)", color: "#fff",
                    border: "1.5px solid #7e22ce", borderRadius: 8, padding: "3px 10px",
                    fontSize: 11, fontWeight: 900,
                    boxShadow: "0 2px 0 rgba(0,0,0,0.2)",
                  }}>💎 {Math.floor(bank.crystals).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* GRID LAYOUT — sidebar categorias + grade */}
            <div className="mochila-body" style={{ display: "grid", gridTemplateColumns: "196px minmax(0, 1fr)", gap: 12 }}>
              {/* SIDEBAR CATEGORIAS */}
              <div style={{
                background: `linear-gradient(180deg, ${P.panel}, ${P.bg1})`,
                border: `2px solid ${P.goldDark}`, borderRadius: 12,
                boxShadow: `inset 0 0 0 1px ${P.goldLight}70`,
                padding: 8, display: "flex", flexDirection: "column", gap: 6,
              }}>
                <div style={{
                  textAlign: "center", fontSize: 10, fontWeight: 900, letterSpacing: 2,
                  color: P.goldDark, padding: "4px 0 6px", borderBottom: `1px dashed ${P.goldDark}55`,
                }}>CATEGORIAS</div>
                {CATS.map((c) => {
                  const active = mochilaCat === c.id;
                  const count = c.id === "all" ? entries.length : entries.filter(([id]) => catOf(id) === c.id).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setMochilaCat(c.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "8px 10px", fontSize: 11.5, fontWeight: 900, letterSpacing: 0.3,
                        background: active
                          ? `linear-gradient(180deg, ${P.goldLight}, ${P.gold})`
                          : `linear-gradient(180deg, ${P.panel}, ${P.bg2})`,
                        color: P.ink,
                        border: `1.5px solid ${active ? P.goldDark : P.gold + "77"}`,
                        borderRadius: 9, cursor: "pointer",
                        boxShadow: active
                          ? `inset 0 0 0 1px #fff8e4, 0 2px 0 rgba(0,0,0,0.25)`
                          : `0 1px 0 rgba(0,0,0,0.1)`,
                        transform: active ? "translateX(3px)" : "translateX(0)",
                        transition: "all 120ms",
                        textAlign: "left", width: "100%",
                      }}
                    >
                      <img
                        src={assetUrlFromJson(c.icon)}
                        alt=""
                        width={44}
                        height={44}
                        style={{
                          imageRendering: "pixelated", flexShrink: 0,
                          filter: active
                            ? "drop-shadow(0 0 8px rgba(212,162,255,0.95)) drop-shadow(0 2px 3px rgba(0,0,0,0.55))"
                            : "drop-shadow(0 0 4px rgba(168,85,247,0.4)) drop-shadow(0 1px 2px rgba(0,0,0,0.55))",
                          animation: active ? "cat-bounce 1.4s ease-in-out infinite" : "cat-bounce 3.2s ease-in-out infinite",
                        }}
                      />
                      <span style={{ flex: 1 }}>{c.label}</span>
                      <span style={{
                        background: active ? P.goldDark : P.ink + "22",
                        color: active ? "#fff8e4" : P.inkSoft,
                        fontSize: 10, fontWeight: 900, padding: "1px 7px",
                        borderRadius: 999, minWidth: 22, textAlign: "center",
                      }}>{count}</span>
                    </button>
                  );
                })}
                <div style={{ flex: 1 }} />
                <div style={{
                  marginTop: 4, padding: "6px 8px", fontSize: 9.5, fontWeight: 700,
                  color: P.inkSoft, textAlign: "center", fontStyle: "italic",
                  borderTop: `1px dashed ${P.goldDark}55`,
                }}>
                  {SLOTS_MIN - filtered.length > 0 ? `${SLOTS_MIN - filtered.length} slots livres` : "Mochila cheia"}
                </div>
              </div>

              {/* GRADE DE ITENS */}
              <div style={{
                background: `linear-gradient(180deg, ${P.panel}dd, ${P.bg1}dd)`,
                border: `2px solid ${P.goldDark}`, borderRadius: 12,
                boxShadow: `inset 0 0 0 1px ${P.goldLight}70, inset 0 0 22px rgba(184,134,42,0.12)`,
                padding: 12, minHeight: 360,
              }}>
                {filtered.length === 0 ? (
                  <div style={{
                    color: P.inkSoft, fontSize: 13, padding: 60, textAlign: "center", fontStyle: "italic",
                  }}>
                    {entries.length === 0
                      ? "Sua mochila está vazia. Derrote Pokémon, abra baús ou visite a Loja!"
                      : "Nenhum item nesta categoria."}
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(126px, 1fr))", gap: 10 }}>
                    {filtered.map(([id, n]) => {
                      const isEgg = id.startsWith("egg_");
                      const color = isEgg ? (EGG_COLORS[id] ?? P.goldLight) : (ITEM_COLORS[id] ?? P.goldLight);
                      const img = ITEM_IMG[id];
                      const Icon = ITEM_ICONS[id] ?? Sparkles;
                      const sellPrice = marketSellPrices[id] ?? 0;
                      return (
                        <div key={id} style={{
                          background: `linear-gradient(180deg, ${P.panel} 0%, ${P.bg1} 100%)`,
                          border: `2px solid ${P.goldDark}`, borderRadius: 10, padding: 8,
                          textAlign: "center", position: "relative",
                          boxShadow: `inset 0 0 0 1px ${P.goldLight}88, 0 3px 0 rgba(0,0,0,0.18)`,
                          display: "flex", flexDirection: "column", gap: 6, alignItems: "center",
                          transition: "transform 120ms, box-shadow 120ms",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `inset 0 0 0 1px #fff8e4, 0 6px 14px rgba(0,0,0,0.35), 0 0 14px ${color}66`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${P.goldLight}88, 0 3px 0 rgba(0,0,0,0.18)`; }}
                        >
                          <div style={{
                            position: "absolute", top: -6, right: -6,
                            background: `linear-gradient(180deg, ${P.rose}, #7a1e12)`, color: "#fff8e4",
                            fontSize: 10, fontWeight: 900, padding: "2px 7px",
                            borderRadius: 999, minWidth: 24, textAlign: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                            border: `1.5px solid ${P.panel}`,
                          }}>x{n}</div>
                          <div
                            onClick={(e) => { e.stopPropagation(); setItemDetail(id); }}
                            title="Ver detalhes"
                            style={{
                            width: 62, height: 62, borderRadius: 10, marginTop: 2,
                            background: `radial-gradient(circle at 30% 30%, ${color}66, ${color}11 55%, ${P.bg2}), ${P.bg1}`,
                            display: "grid", placeItems: "center",
                            border: `2px inset ${P.goldDark}aa`,
                            boxShadow: `inset 0 2px 6px rgba(0,0,0,0.25), 0 0 10px ${color}44`,
                            position: "relative", overflow: "hidden", cursor: "pointer",
                          }}>
                            {img ? (
                              <img
                                src={assetUrlFromJson(img)}
                                alt=""
                                width={52}
                                height={52}
                                loading="lazy"
                                style={{
                                  imageRendering: "pixelated",
                                  filter: `drop-shadow(0 0 6px ${color}aa) drop-shadow(0 2px 2px rgba(0,0,0,0.45))`,
                                  animation: "item-float 2.4s ease-in-out infinite",
                                }}
                              />
                            ) : (
                              <ItemPixelIcon id={id} size={52} color={color} />
                            )}
                          </div>
                          <div style={{
                            fontSize: 10.5, fontWeight: 900, color: P.ink, letterSpacing: 0.2, lineHeight: 1.15,
                            minHeight: 24, display: "flex", alignItems: "center",
                          }}>{NAMES[id] ?? id}</div>
                          <div style={{ display: "flex", gap: 4, width: "100%" }}>
                            <button
                              onClick={() => {
                                const bulk = id === "book_atk" || id === "book_def" || id === "potion";
                                if (bulk && n > 1) {
                                  const raw = window.prompt(`Usar quantos ${NAMES[id] ?? id}? (1–${n})`, String(n));
                                  if (raw == null) return;
                                  const q = Math.max(1, Math.min(n, parseInt(raw, 10) || 1));
                                  onUseItem(id, q);
                                } else {
                                  onUseItem(id, 1);
                                }
                              }}
                              style={{
                                flex: 1, padding: "5px 4px", fontSize: 10, fontWeight: 900,
                                background: `linear-gradient(180deg, ${P.goldLight}, ${P.gold})`,
                                color: P.ink, border: `1.5px solid ${P.goldDark}`,
                                borderRadius: 6, cursor: "pointer", letterSpacing: 0.5,
                                boxShadow: `0 2px 0 ${P.goldDark}`,
                              }}
                            >{isEgg ? "CHOCAR" : "USAR"}</button>
                            {sellPrice > 0 && !id.startsWith("stone_") && (
                              <button
                                onClick={() => onSellItem(id, 1)}
                                title={`Vender 1 por ${sellPrice} ouro`}
                                style={{
                                  flex: 1, padding: "5px 4px", fontSize: 10, fontWeight: 900,
                                  background: `linear-gradient(180deg, ${P.roseSoft}, ${P.rose})`,
                                  color: "#fff8e4", border: `1.5px solid #7a1e12`,
                                  borderRadius: 6, cursor: "pointer", letterSpacing: 0.3,
                                  boxShadow: `0 2px 0 #7a1e12`,
                                }}
                              >💰{sellPrice}</button>
                            )}

                            {id.startsWith("stone_") && (
                              <button
                                onClick={() => {
                                  const maxBatches = Math.floor(n / 250);
                                  if (maxBatches <= 0) return;
                                  const raw = window.prompt(`Vender quantos lotes? (1–${maxBatches})\n250 stones = 2 💚 Safiras`, String(maxBatches));
                                  if (raw == null) return;
                                  const b = Math.max(1, Math.min(maxBatches, parseInt(raw, 10) || 1));
                                  onSellItem(id, b * 250, "safira");
                                }}
                                title="Vender por Safira Verde (250 stones = 2 safiras)"
                                disabled={n < 250}
                                style={{
                                  padding: "5px 6px", fontSize: 10, fontWeight: 900,
                                  background: n < 250 ? "#334155" : "linear-gradient(180deg,#6ee7a8,#059669)",
                                  color: "#0b2540", border: "1.5px solid #065f46",
                                  borderRadius: 6, cursor: n < 250 ? "not-allowed" : "pointer",
                                  boxShadow: "0 2px 0 #065f46", opacity: n < 250 ? 0.5 : 1,
                                }}
                              >💚</button>
                            )}

                          </div>
                          {(() => {
                            const UP: Record<string, { to: string; cost: number; trainerLv: number; label: string }> = {
                              book_exp: { to: "book_exp_big", cost: 3, trainerLv: 10, label: "EXP Raro" },
                              book_exp_big: { to: "book_exp_max", cost: 3, trainerLv: 25, label: "EXP Lendário" },
                              book_vip: { to: "book_vip_30", cost: 5, trainerLv: 20, label: "VIP 30d" },
                              book_vip_30: { to: "book_vip_60", cost: 3, trainerLv: 40, label: "VIP 60d" },
                            };
                            const rule = UP[id];
                            if (!rule) return null;
                            const okLv = trainerLevel >= rule.trainerLv;
                            const okQty = n >= rule.cost;
                            const enabled = okLv && okQty;
                            const title = !okLv
                              ? `Requer Treinador Lv.${rule.trainerLv}`
                              : !okQty
                                ? `Precisa de ${rule.cost}× (você tem ${n})`
                                : `Forjar ${rule.label} usando ${rule.cost}×`;
                            return (
                              <button
                                onClick={() => onUpgradeBook(id)}
                                disabled={!enabled}
                                title={title}
                                style={{
                                  marginTop: 2, width: "100%", padding: "5px 4px", fontSize: 9.5, fontWeight: 900,
                                  background: enabled ? "linear-gradient(180deg, #8bffb0, #3a8a5a)" : `${P.bg3}88`,
                                  color: enabled ? "#0b2010" : P.inkSoft,
                                  border: `1.5px solid ${enabled ? "#2a5a3a" : P.gold + "77"}`,
                                  borderRadius: 6, cursor: enabled ? "pointer" : "not-allowed", letterSpacing: 0.3,
                                }}
                              >⚒️ {rule.label}</button>
                            );
                          })()}
                        </div>
                      );
                    })}
                    {Array.from({ length: emptyCount }).map((_, i) => (
                      <div key={`empty-${i}`} style={{
                        background: `${P.bg2}55`,
                        border: `2px dashed ${P.gold}66`, borderRadius: 10,
                        minHeight: 150,
                        boxShadow: `inset 0 0 12px ${P.gold}22`,
                      }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <style>{`
              @media (max-width: 720px) {
                .mochila-body { grid-template-columns: 1fr !important; }
              }
            `}</style>

            {itemDetail && (() => {
              const id = itemDetail;
              const isEgg = id.startsWith("egg_");
              const color = isEgg ? (EGG_COLORS[id] ?? P.goldLight) : (ITEM_COLORS[id] ?? P.goldLight);
              const img = ITEM_IMG[id];
              const name = NAMES[id] ?? id;
              const desc = ITEM_DESC[id] ?? "Item do universo IdleMon. Ainda sem descrição detalhada.";
              const count = items[id] ?? 0;
              const sellPrice = marketSellPrices[id] ?? 0;
              return (
                <div onClick={() => setItemDetail(null)} style={{
                  position: "fixed", inset: 0, zIndex: 9999,
                  background: "rgba(4,4,10,0.72)", backdropFilter: "blur(6px)",
                  display: "grid", placeItems: "center", padding: 16,
                }}>
                  <div onClick={(e) => e.stopPropagation()} style={{
                    width: "min(420px, 96vw)", position: "relative",
                    background: `linear-gradient(180deg, ${P.panel}, ${P.bg1})`,
                    border: `2px solid ${P.goldDark}`, borderRadius: 14,
                    boxShadow: `inset 0 0 0 1px ${P.goldLight}88, 0 0 40px ${color}55, 0 12px 40px rgba(0,0,0,0.6)`,
                    padding: 18, color: P.ink,
                  }}>
                    <button onClick={() => setItemDetail(null)} style={{
                      position: "absolute", top: 8, right: 10, background: "transparent",
                      border: "none", color: P.inkSoft, fontSize: 20, cursor: "pointer", fontWeight: 900,
                    }}>×</button>
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{
                        width: 84, height: 84, borderRadius: 12, flexShrink: 0,
                        background: `radial-gradient(circle at 30% 30%, ${color}66, ${color}11 55%, ${P.bg2}), ${P.bg1}`,
                        display: "grid", placeItems: "center",
                        border: `2px inset ${P.goldDark}aa`,
                        boxShadow: `inset 0 2px 6px rgba(0,0,0,0.25), 0 0 14px ${color}66`,
                      }}>
                        {img ? (
                          <img src={assetUrlFromJson(img)} alt="" width={68} height={68} style={{ imageRendering: "pixelated", filter: `drop-shadow(0 0 6px ${color}aa)` }} />
                        ) : (
                          <ItemPixelIcon id={id} size={68} color={color} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 900, lineHeight: 1.2 }}>{name}</div>
                        <div style={{ fontSize: 11, color: P.inkSoft, marginTop: 4, fontWeight: 700 }}>Quantidade: <span style={{ color: P.gold }}>x{count}</span></div>
                        {sellPrice > 0 && (
                          <div style={{ fontSize: 11, color: P.inkSoft, marginTop: 2, fontWeight: 700 }}>Preço de venda: <span style={{ color: "#ffd66b" }}>{sellPrice} 🪙</span></div>
                        )}
                      </div>
                    </div>
                    <div style={{
                      marginTop: 14, padding: 12, borderRadius: 10,
                      background: `${P.bg2}80`, border: `1px dashed ${P.goldDark}88`,
                      fontSize: 12.5, lineHeight: 1.5, color: P.ink,
                    }}>{desc}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                      {!isEgg && count > 0 && (
                        <button onClick={() => { onUseItem(id, 1); setItemDetail(null); }} style={{
                          flex: 1, padding: "9px 10px", fontSize: 12, fontWeight: 900,
                          background: `linear-gradient(180deg, ${P.goldLight}, ${P.gold})`,
                          color: P.ink, border: `1.5px solid ${P.goldDark}`,
                          borderRadius: 8, cursor: "pointer", letterSpacing: 0.5,
                          boxShadow: `0 2px 0 ${P.goldDark}`,
                        }}>USAR</button>
                      )}
                      {isEgg && count > 0 && (
                        <button onClick={() => { onUseItem(id, 1); setItemDetail(null); }} style={{
                          flex: 1, padding: "9px 10px", fontSize: 12, fontWeight: 900,
                          background: `linear-gradient(180deg, ${P.goldLight}, ${P.gold})`,
                          color: P.ink, border: `1.5px solid ${P.goldDark}`,
                          borderRadius: 8, cursor: "pointer", letterSpacing: 0.5,
                          boxShadow: `0 2px 0 ${P.goldDark}`,
                        }}>CHOCAR</button>
                      )}
                      <button onClick={() => setItemDetail(null)} style={{
                        flex: 1, padding: "9px 10px", fontSize: 12, fontWeight: 900,
                        background: "transparent", color: P.inkSoft,
                        border: `1.5px solid ${P.goldDark}`, borderRadius: 8, cursor: "pointer",
                      }}>FECHAR</button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          </div>
        );
      })()}

      {tab === "colecao" && (
        <div style={{
          background: "linear-gradient(180deg, #f5e6c8 0%, #e8d4a8 100%)",
          border: "3px solid #b8862a",
          borderRadius: 14, padding: 18,
          boxShadow: "inset 0 0 24px rgba(184,134,42,0.25), 0 4px 18px rgba(0,0,0,0.4)",
        }}>
          {/* HUD topo da coleção */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 14, paddingBottom: 12,
            borderBottom: "2px solid rgba(184,134,42,0.5)",
          }}>
            <div>
              <div style={{ color: "#6b4a10", fontSize: 20, fontWeight: 900, letterSpacing: 3, fontFamily: "Georgia, serif" }}>
                ✦ COLEÇÃO ✦
              </div>
              <div style={{ color: "#8b6a30", fontSize: 12, marginTop: 2, fontStyle: "italic" }}>
                Registro particular do treinador
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ background: collection.length >= MAX_COLLECTION ? "#c0392b" : "#b8862a", color: "#fff9e8", fontWeight: 900, padding: "8px 14px", borderRadius: 20, fontSize: 12, boxShadow: "0 2px 8px rgba(184,134,42,0.5)" }}>
                {collection.length} / {MAX_COLLECTION} NA COLEÇÃO
              </div>
              <div style={{ background: "#8b6a30", color: "#fff9e8", fontWeight: 900, padding: "8px 14px", borderRadius: 20, fontSize: 12 }}>
                {caughtSpecies.length} ESPÉCIES
              </div>
              <div style={{ background: "linear-gradient(180deg,#7c3aed,#4f26a4)", color: "#fff9e8", fontWeight: 900, padding: "8px 14px", borderRadius: 20, fontSize: 12, boxShadow: "0 2px 8px rgba(124,58,237,0.5)" }}>
                ⚒️ {craftPoints} PTS CRAFT
              </div>
            </div>
          </div>
          {/* Filtros */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12, padding: "8px 10px", background: "rgba(107,74,16,0.12)", borderRadius: 10, border: "1px dashed rgba(107,74,16,0.35)" }}>
            <input
              value={colFilterName}
              onChange={(e) => setColFilterName(e.target.value)}
              placeholder="🔍 Buscar por nome..."
              style={{ flex: "1 1 160px", minWidth: 140, padding: "6px 10px", fontSize: 12, fontWeight: 700, borderRadius: 8, border: "1px solid #b8862a", background: "#fff8e5", color: "#4a3010" }}
            />
            <select value={colFilterRarity} onChange={(e) => setColFilterRarity(e.target.value as "all" | Rarity)}
              style={{ padding: "6px 10px", fontSize: 12, fontWeight: 800, borderRadius: 8, border: "1px solid #b8862a", background: "#fff8e5", color: "#4a3010" }}>
              <option value="all">Todas raridades</option>
              <option value="common">Comum</option>
              <option value="uncommon">Incomum</option>
              <option value="rare">Raro</option>
              <option value="epic">Épico</option>
              <option value="legendary">Lendário</option>
              <option value="mythic">Mítico</option>
              <option value="mythic_shiny">Mítico Brilhante</option>
            </select>
            <select value={colSort} onChange={(e) => setColSort(e.target.value as typeof colSort)}
              style={{ padding: "6px 10px", fontSize: 12, fontWeight: 800, borderRadius: 8, border: "1px solid #b8862a", background: "#fff8e5", color: "#4a3010" }}>
              <option value="recent">Mais recentes</option>
              <option value="level_desc">Nível ↓</option>
              <option value="level_asc">Nível ↑</option>
              <option value="rarity">Raridade</option>
              <option value="name">Nome</option>
            </select>
            <button
              onClick={() => setColOnlyLocked((v) => !v)}
              style={{
                padding: "6px 12px", fontSize: 12, fontWeight: 900, borderRadius: 8,
                border: "1px solid #b8862a", cursor: "pointer",
                background: colOnlyLocked ? "linear-gradient(180deg,#facc15,#b8862a)" : "#fff8e5",
                color: colOnlyLocked ? "#4a3010" : "#8b6a30",
              }}
              title="Mostrar somente Pokémon travados"
            >🔒 {colOnlyLocked ? "SÓ TRAVADOS" : "TRAVADOS"}</button>
            <button
              onClick={() => { setBulkMode((v) => !v); setBulkSel(new Set()); }}
              style={{
                padding: "6px 12px", fontSize: 12, fontWeight: 900, borderRadius: 8,
                border: "1px solid #6b21a8", cursor: "pointer",
                background: bulkMode ? "linear-gradient(180deg,#a78bfa,#5b21b6)" : "#f3e8ff",
                color: bulkMode ? "#fff" : "#5b21b6",
                boxShadow: bulkMode ? "0 0 10px rgba(167,139,250,0.6)" : "none",
              }}
              title="Selecionar vários para fragmentar de uma vez"
            >☑ {bulkMode ? "SELECIONANDO" : "SELECIONAR"}</button>
            {bulkMode && bulkSel.size > 0 && (
              <button
                onClick={() => openFragConfirm([...bulkSel])}
                style={{
                  padding: "6px 14px", fontSize: 12, fontWeight: 900, borderRadius: 8,
                  border: "1px solid #3b0f7a", cursor: "pointer",
                  background: "linear-gradient(180deg,#c084fc,#6b21a8)",
                  color: "#fff",
                  boxShadow: "0 0 12px rgba(192,132,252,0.7)",
                }}
              >⚒️ FRAGMENTAR {bulkSel.size}</button>
            )}
            <div style={{ fontSize: 11, color: "#6b4a10", fontWeight: 800 }}>
              🔒 {lockedSet.size} travados
            </div>
          </div>

          {collection.length === 0 ? (
            <div style={{ color: "#8b6a30", fontSize: 13, padding: 30, textAlign: "center", fontStyle: "italic" }}>
              Nenhum Pokémon capturado ainda. Continue a jornada — a taxa de captura é baixa (5%).
            </div>
          ) : (() => {
            const rarityOrder: Record<Rarity, number> = {
              common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5, mythic_shiny: 6,
            } as Record<Rarity, number>;
            const q = colFilterName.trim().toLowerCase();
            const filtered = collection.filter((e) => {
              if (colFilterRarity !== "all" && e.rarity !== colFilterRarity) return false;
              if (q && !e.species.toLowerCase().includes(q)) return false;
              if (colOnlyLocked && !lockedSet.has(e.uid)) return false;
              return true;
            });
            filtered.sort((a, b) => {
              if (colSort === "recent") return b.capturedAt - a.capturedAt;
              if (colSort === "level_desc") return b.level - a.level;
              if (colSort === "level_asc") return a.level - b.level;
              if (colSort === "rarity") return (rarityOrder[b.rarity] ?? 0) - (rarityOrder[a.rarity] ?? 0);
              return a.species.localeCompare(b.species);
            });
            if (filtered.length === 0) {
              return <div style={{ color: "#8b6a30", fontSize: 13, padding: 30, textAlign: "center", fontStyle: "italic" }}>Nenhum Pokémon corresponde aos filtros.</div>;
            }
            return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
              {filtered.map((entry, i) => {
                const sp = entry.species;
                const isCurrent = leader?.species === sp && leader?.uid === entry.uid;
                const teamPet = team.find((p) => p.uid === entry.uid);
                const inTeam = !!teamPet;
                const displayLevel = teamPet?.level ?? entry.level;
                const rarityColor: Partial<Record<Rarity, string>> = {
                  common: "#8b6a30", uncommon: "#5ec26a", rare: "#4a9eff",
                  epic: "#c084fc", legendary: "#ff8b3d", mythic: "#ff5252", mythic_shiny: "#ffd94d",
                };
                const rColor = rarityColor[entry.rarity] ?? "#8b6a30";
                const gain = CRAFT_BY_RARITY[entry.rarity] ?? 1;
                const locked = lockedSet.has(entry.uid);
                 const traits = entry.traits ?? [];
                 const fragDisabled = inTeam || locked;
                 const isSelected = bulkSel.has(entry.uid);
                 const canBulkPick = !inTeam && !locked;
                 const isBMP = !!entry.event && entry.event.startsWith("black_mitic");
                 const isBrilhant = !!entry.event && entry.event.includes("brilhant");
                 const bmpAccent = isBrilhant ? "#ff97e1" : "#a066ff";
                 return (
                   <div
                     key={entry.uid}
                     onClick={() => {
                       if (!bulkMode) return;
                       if (!canBulkPick) return;
                       toggleBulk(entry.uid);
                     }}
                     style={{
                       background: isBMP
                         ? "linear-gradient(160deg, #1a0530 0%, #0a021a 55%, #050010 100%)"
                         : locked
                         ? "linear-gradient(180deg, #fff4c8, #f7dc9a)"
                         : isSelected
                           ? "linear-gradient(180deg, #ede9fe, #c4b5fd)"
                           : "linear-gradient(180deg, #fff8e5, #f5e6c8)",
                       border: `2.5px solid ${isBMP ? bmpAccent : (isSelected ? "#7c3aed" : locked ? "#eab308" : (isCurrent ? "#5ec26a" : "#b8862a"))}`,
                       borderRadius: 12, padding: 10, textAlign: "center",
                       position: "relative",
                       overflow: "hidden",
                       boxShadow: isBMP
                         ? `0 4px 14px rgba(0,0,0,0.6), 0 0 22px ${bmpAccent}88, inset 0 0 26px ${bmpAccent}33`
                         : `0 2px 8px rgba(0,0,0,0.15), inset 0 0 12px ${rColor}22${locked ? ", 0 0 10px rgba(234,179,8,0.5)" : ""}${isSelected ? ", 0 0 14px rgba(124,58,237,0.7)" : ""}`,
                       display: "grid",
                       gridTemplateRows: "auto auto auto auto 36px",
                       gap: 4,
                       alignItems: "center",
                       justifyItems: "center",
                       minHeight: 220,
                       cursor: bulkMode ? (canBulkPick ? "pointer" : "not-allowed") : "default",
                     }}
                   >
                     {isBMP && (
                       <div style={{
                         position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
                         background: `radial-gradient(circle at 50% 20%, ${bmpAccent}55, transparent 60%), radial-gradient(circle at 80% 90%, ${bmpAccent}33, transparent 55%)`,
                       }} />
                     )}
                    <div style={{ position: "absolute", top: 4, left: 6, fontSize: 9, fontWeight: 900, color: "#8b6a30", letterSpacing: 1, zIndex: 2 }}>
                      #{String(i + 1).padStart(3, "0")}
                    </div>
                    {inTeam && (
                      <div style={{ position: "absolute", top: 4, right: 6, fontSize: 9, fontWeight: 900, color: "#3d7a4a", zIndex: 2 }}>★ TIME</div>
                    )}
                    {/* Checkbox de bulk select */}
                    {bulkMode && canBulkPick && (
                      <div style={{
                        position: "absolute", top: 6, left: 26,
                        width: 22, height: 22, borderRadius: 6,
                        border: `2px solid ${isSelected ? "#7c3aed" : "#8b6a30"}`,
                        background: isSelected ? "linear-gradient(180deg,#a78bfa,#5b21b6)" : "#fff8e5",
                        color: "#fff", fontSize: 14, fontWeight: 900,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: isSelected ? "0 0 8px rgba(124,58,237,0.7)" : "none",
                        zIndex: 3,
                      }}>{isSelected ? "✓" : ""}</div>
                    )}
                    {/* Botão cadeado */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLock(entry.uid); }}
                      title={locked ? "Destravar (permite fragmentar)" : "Travar (protege de fragmentar)"}
                      style={{
                        position: "absolute", top: 22, right: 4,
                        width: 24, height: 24, borderRadius: "50%",
                        border: "1px solid #b8862a", cursor: "pointer",
                        background: locked ? "linear-gradient(180deg,#facc15,#b8862a)" : "#fff8e5",
                        color: locked ? "#4a3010" : "#8b6a30",
                        fontSize: 12, fontWeight: 900, padding: 0, zIndex: 2,
                      }}
                    >{locked ? "🔒" : "🔓"}</button>

                    {/* Sprite + nome */}
                     <button
                       onClick={(e) => { e.stopPropagation(); if (bulkMode) { if (canBulkPick) toggleBulk(entry.uid); return; } onOpenColecaoDetail(entry.uid); }}
                       style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", justifySelf: "center", width: "100%", position: "relative", zIndex: 1 }}
                       title={bulkMode ? "Selecionar/deselecionar" : "Ver detalhes"}
                     >
                       {gifMap[sp] && <img src={assetUrlFromJson(gifMap[sp])} alt="" style={{ width: 64, height: 64, imageRendering: "pixelated", marginTop: 6, display: "block", filter: isBMP ? `drop-shadow(0 0 8px ${bmpAccent})` : undefined }} />}
                       <div style={{ fontSize: 11, marginTop: 2, color: isBMP ? "#f7ecff" : "#4a3010", fontWeight: 800, textAlign: "center", textShadow: isBMP ? "0 1px 3px #000" : undefined }}>{sp.replace(/_/g, " ").toUpperCase()}</div>
                     </button>

                     {/* Raridade / Badge BMP */}
                     <div style={{
                       fontSize: 9, padding: "2px 8px", borderRadius: 10,
                       background: isBMP ? `linear-gradient(180deg, ${bmpAccent}, #4a1080)` : rColor,
                       color: "#fff", justifySelf: "center", fontWeight: 900, letterSpacing: 1,
                       boxShadow: isBMP ? `0 0 8px ${bmpAccent}bb` : undefined,
                       border: isBMP ? "1px solid rgba(255,255,255,0.25)" : undefined,
                       position: "relative", zIndex: 1,
                     }}>
                       {isBMP ? (isBrilhant ? "BLACK MITIC BRILHANT PLUS" : "BLACK MITIC PLUS") : entry.rarity.toUpperCase()}
                     </div>

                     {/* Nível */}
                     <div style={{ fontSize: 11, color: isBMP ? "#f5cf6b" : "#6b4a10", fontWeight: 900, position: "relative", zIndex: 1, textShadow: isBMP ? "0 1px 2px #000" : undefined }}>
                       Nv. {displayLevel}{inTeam && teamPet && teamPet.level !== entry.level ? ` (cap. Nv.${entry.level})` : ""}
                     </div>

                     {/* Traits — mostra TODOS (até 6) para Black Mitic */}
                     <div
                       style={{
                         display: "flex", gap: 3, justifyContent: "center", alignItems: "center",
                         flexWrap: "wrap", minHeight: 28, position: "relative", zIndex: 1,
                         padding: isBMP ? "4px 6px" : 0,
                         background: isBMP ? "rgba(0,0,0,0.35)" : "transparent",
                         border: isBMP ? `1px solid ${bmpAccent}66` : "none",
                         borderRadius: isBMP ? 8 : 0,
                         width: isBMP ? "100%" : "auto",
                       }}
                       title={traits.length ? traits.map((id) => TRAITS[id]?.name).filter(Boolean).join(" · ") : "Sem traits"}
                     >
                       {traits.length > 0
                         ? traits.slice(0, isBMP ? 6 : 4).map((id) => <TraitIcon key={id} id={id} size={isBMP ? 20 : 22} />)
                         : <span style={{ fontSize: 9, color: "#b8a066", fontWeight: 700, letterSpacing: 0.5, opacity: 0.7 }}>— sem traits —</span>}
                     </div>


                    {/* Botão fragmentar (ícone cristal) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (inTeam) { alert("Retire do time antes de fragmentar."); return; }
                        if (locked) { alert("Este Pokémon está TRAVADO 🔒. Destrave para fragmentar."); return; }
                        if (bulkMode) { toggleBulk(entry.uid); return; }
                        openFragConfirm([entry.uid]);
                      }}
                      disabled={fragDisabled}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "4px 10px", height: 36,
                        background: fragDisabled
                          ? "linear-gradient(180deg,#d9c8a8,#b8a680)"
                          : "linear-gradient(180deg,#c4b5fd 0%,#8b5cf6 45%,#5b21b6 100%)",
                        color: "#fff", fontWeight: 900, fontSize: 12, letterSpacing: 0.5,
                        border: fragDisabled ? "1px solid #96835a" : "1px solid #3b0f7a",
                        borderRadius: 9,
                        boxShadow: fragDisabled
                          ? "inset 0 -2px 0 rgba(0,0,0,0.15)"
                          : "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.35), 0 0 14px rgba(167,139,250,0.75)",
                        cursor: fragDisabled ? "not-allowed" : "pointer",
                        opacity: fragDisabled ? 0.75 : 1,
                        transition: "transform 90ms, filter 120ms",
                        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                      }}
                      onMouseEnter={(e) => { if (!fragDisabled) (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.15)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; }}
                      title={inTeam ? "No time — não pode fragmentar" : locked ? "Travado — destrave para fragmentar" : `Fragmentar por +${gain} pts de craft`}
                    >
                      {inTeam ? (
                        <span style={{ fontWeight: 900 }}>★ NO TIME</span>
                      ) : locked ? (
                        <span style={{ fontWeight: 900 }}>🔒 TRAVADO</span>
                      ) : (
                        <div>
                          <span style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: 34, height: 34, borderRadius: "50%",
                            background: "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.55), rgba(196,181,253,0.15) 55%, transparent 75%)",
                            boxShadow: "0 0 10px rgba(233,213,255,0.8), inset 0 0 8px rgba(124,58,237,0.35)",
                          }}>
                            <img
                              src={assetUrlFromJson(iconFragmentCrystal)}
                              alt=""
                              width={30}
                              height={30}
                              style={{ imageRendering: "pixelated", filter: "drop-shadow(0 0 4px rgba(233,213,255,0.9)) drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
                            />
                          </span>
                          <span style={{ fontSize: 13 }}>+{gain}</span>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            );
          })()}
        </div>
      )}



      {tab === "pokedex" && (
        <div style={{
          background: "linear-gradient(180deg, #2a0510, #1a0510)",
          border: "2px solid #e11d48",
          borderRadius: 10, padding: 14,
          boxShadow: "inset 0 0 30px rgba(225,29,72,0.25)",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #e11d4855",
          }}>
            <div>
              <div style={{ color: "#ff6b8a", fontSize: 18, fontWeight: 900, letterSpacing: 2 }}>
                📕 POKÉDEX
              </div>
              <div style={{ color: "#ffb3c1", fontSize: 11, marginTop: 2 }}>
                Registro de Pokémon enfrentados em duelos
              </div>
            </div>
            <div style={{
              background: "#e11d48", color: "#fff", fontWeight: 900,
              padding: "6px 14px", borderRadius: 20, fontSize: 13,
              boxShadow: "0 0 12px #e11d4888",
            }}>
              {seenSpecies.length} REGISTRADO{seenSpecies.length === 1 ? "" : "S"}
            </div>
          </div>
          {seenSpecies.length === 0 ? (
            <div style={{ color: "#ffb3c1", fontSize: 13, padding: 30, textAlign: "center", fontStyle: "italic" }}>
              Nenhum Pokémon registrado ainda. Derrote inimigos em batalha para registrá-los!
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
              {seenSpecies.map((sp, i) => {
                const caught = caughtSpecies.includes(sp);
                return (
                  <div key={sp} style={{
                    background: "linear-gradient(180deg, #3a0a1a, #1a0510)",
                    border: `2px solid ${caught ? "#ffd94d" : "#e11d48"}`,
                    borderRadius: 8, padding: 8, textAlign: "center",
                    boxShadow: caught ? "0 0 10px #ffd94d55" : "0 0 8px #e11d4844",
                  }}>
                    <div style={{ fontSize: 9, color: "#ff6b8a", fontWeight: 800, letterSpacing: 1 }}>
                      Nº {String(i + 1).padStart(3, "0")}
                    </div>
                    {gifMap[sp] && <img src={assetUrlFromJson(gifMap[sp])} alt="" style={{ width: 56, height: 56, imageRendering: "pixelated" }} />}
                    <div style={{ fontSize: 11, marginTop: 2, color: "#fff", fontWeight: 700 }}>
                      {sp.replace(/_/g, " ").toUpperCase()}
                    </div>
                    <div style={{ fontSize: 9, marginTop: 4, color: caught ? "#ffd94d" : "#ff6b8a", fontWeight: 800 }}>
                      {caught ? "★ CAPTURADO" : "✓ VISTO"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}



      {tab === "loja" && (
        <div style={{
            display: "flex", gap: 12, marginBottom: 16, padding: "10px 14px",
            background: "linear-gradient(180deg, #1a0f26, #251638)",
            border: "1px solid rgba(245,207,107,0.25)", borderRadius: 8,
            alignItems: "center", justifyContent: "space-around", fontWeight: 800,
          }}>
            <span style={{ color: "#f4c430" }}>● Ouro: {fmtK(bank.gold)}</span>
            <span style={{ color: "#c084fc" }}>💎 Cristais: {Math.floor(bank.crystals)}</span>
        </div>
      )}

      {tab === "loja" && (
        <div>
          {(() => {
            const bk = SHOP_BOOKS.find((x) => x.id === "orb_team")!;
            const owned = items[bk.id] ?? 0;
            const canBuy = bank.crystals >= bk.price;
            const activeUntil = buffs.teamOrbUntil ?? 0;
            const isActive = activeUntil > Date.now();
            const color = ITEM_COLORS[bk.id] ?? "#ff97e1";
            return (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ color: "#ff97e1", fontSize: 15, margin: "6px 0 10px" }}>✦ Destaque da Loja — Orb de Time</h3>
                <div style={{
                  display: "grid", gridTemplateColumns: "minmax(92px, 120px) 1fr minmax(180px, 220px)", gap: 14,
                  alignItems: "center", padding: 16,
                  background: "linear-gradient(135deg, rgba(255,151,225,0.18), rgba(26,15,38,0.96) 42%, rgba(40,20,58,0.96))",
                  border: `2px solid ${color}`,
                  borderRadius: 14,
                  boxShadow: `0 0 22px ${color}44, inset 0 1px 0 rgba(255,255,255,0.14)`,
                }}>
                  <div style={{
                    width: 92, height: 92, borderRadius: 18,
                    background: `radial-gradient(circle at 35% 25%, ${color}66, rgba(11,5,16,0.8) 72%)`,
                    border: `1px solid ${color}99`, display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 0 18px ${color}55, inset 0 0 18px rgba(255,255,255,0.08)`,
                  }}>
                    <img src={assetUrlFromJson(bk.img)} alt="Orb de Time" width={72} height={72} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "#fff0fb", fontSize: 18, fontWeight: 900, letterSpacing: 1 }}>{bk.name}</div>
                    <div style={{ color: "#eac6df", fontSize: 12, lineHeight: 1.45, marginTop: 4 }}>{bk.desc}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                      <span style={{ color: "#c084fc", fontSize: 12, fontWeight: 900 }}>💎 {bk.price} cristais</span>
                      <span style={{ color: "#8a7a9c", fontSize: 12 }}>Você tem: {owned}</span>
                      {isActive && <span style={{ color: "#7ef2a2", fontSize: 12, fontWeight: 900 }}>ATIVO</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => onBuyBook(bk)}
                    disabled={!canBuy}
                    style={{
                      width: "100%", padding: "11px 12px", fontWeight: 900, letterSpacing: 1,
                      background: canBuy ? `linear-gradient(180deg, ${color}, #c84aa4)` : "#3a2a4a",
                      color: canBuy ? "#120713" : "#6a5a7c",
                      border: canBuy ? "1px solid #ffd9f5" : "1px solid #4a3a5a",
                      borderRadius: 8,
                      cursor: canBuy ? "pointer" : "not-allowed",
                      boxShadow: canBuy ? `0 0 12px ${color}55` : "none",
                    }}
                  >{canBuy ? "COMPRAR ORB" : "SEM CRISTAIS"}</button>
                </div>
              </div>
            );
          })()}

          <h3 style={{ color: "#6bd4ff", fontSize: 15, margin: "6px 0 10px" }}>Poções — pagas em ouro</h3>
          <div style={{
            background: "linear-gradient(160deg, #0f1f2e 0%, #16324a 100%)",
            border: "1px solid #6bd4ff55", borderRadius: 12, padding: 14, marginBottom: 20,
            display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
          }}>
            <div style={{ fontSize: 40 }}>🧪</div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontWeight: 800, color: "#eadfe8" }}>Poção</div>
              <div style={{ fontSize: 11, color: "#b8a8c8" }}>Recupera {Math.round(POTION_HEAL_PCT * 100)}% do HP. Usada no auto quando ativado.</div>
              <div style={{ fontSize: 12, color: "#f4c430", fontWeight: 700 }}>● {POTION_PRICE} ouro cada</div>
              <div style={{ fontSize: 11, color: "#8a7a9c" }}>Você tem: {items.potion ?? 0}</div>
            </div>
            <div style={{ minWidth: 220 }}>
              <QtyBuy
                presets={[1, 10, 50, 100]}
                max={9999}
                unitLabel="poção"
                buttonColor="#6bd4ff"
                canBuyFn={(n) => bank.gold >= POTION_PRICE * n}
                onBuy={(n) => onBuyPotion(n)}
                disabledLabel="SEM OURO"
              />
            </div>
          </div>


          <h3 style={{ color: "#f5cf6b", fontSize: 15, margin: "6px 0 10px" }}>Pokébolas — pagas em ouro</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
            {SHOP_BALLS.map((b) => {
              const owned = items[b.id] ?? 0;
              const canBuy = bank.gold >= b.price;
              const color = ITEM_COLORS[b.id] ?? "#f5cf6b";
              return (
                <div key={b.id} style={{
                  background: "linear-gradient(160deg, #1a0f26 0%, #251638 100%)",
                  border: `1px solid ${color}55`, borderRadius: 12, padding: 14,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  boxShadow: `0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 ${color}22`,
                }}>
                  <img src={assetUrlFromJson(b.img)} alt="" width={64} height={64}
                    style={{ imageRendering: "pixelated", filter: `drop-shadow(0 0 8px ${color}88)` }} />
                  <div style={{ fontWeight: 800, color: "#eadfe8", fontSize: 14 }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: "#b8a8c8" }}>Chance de captura x{b.captureMult}</div>
                  <div style={{ fontSize: 12, color: "#f4c430", fontWeight: 700 }}>● {b.price} ouro</div>
                  <div style={{ fontSize: 11, color: "#8a7a9c" }}>Você tem: {owned}</div>
                  <QtyBuy
                    presets={[1, 10, 50, 100]}
                    max={9999}
                    unitLabel={b.name}
                    buttonColor={color}
                    canBuyFn={(n) => bank.gold >= b.price * n}
                    onBuy={(n) => onBuyBall(b, n)}
                    disabledLabel="SEM OURO"
                  />
                </div>
              );
            })}
          </div>

          <h3 style={{ color: "#c084fc", fontSize: 15, margin: "6px 0 10px" }}>Pacote de Ultra Ball — pago em cristais 💎</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 20 }}>
            {(() => {
              const COST = 2000, QTY = 20;
              const owned = items.ultraball ?? 0;
              const canBuy = bank.crystals >= COST;
              const color = "#c084fc";
              return (
                <div style={{
                  background: "linear-gradient(160deg, #1a0f26 0%, #251638 100%)",
                  border: `1px solid ${color}77`, borderRadius: 12, padding: 14,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  boxShadow: `0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 ${color}22`,
                }}>
                  <img src={assetUrlFromJson(ballUltraImg)} alt="" width={64} height={64}
                    style={{ imageRendering: "pixelated", filter: `drop-shadow(0 0 10px ${color}bb)` }} />
                  <div style={{ fontWeight: 800, color: "#eadfe8", fontSize: 14 }}>Pacote Ultra Ball ×{QTY}</div>
                  <div style={{ fontSize: 11, color: "#b8a8c8", textAlign: "center" }}>20 Ultra Ball — captura x3.5</div>
                  <div style={{ fontSize: 12, color, fontWeight: 700 }}>💎 {COST} cristais</div>
                  <div style={{ fontSize: 11, color: "#8a7a9c" }}>Você tem: {owned} Ultra Ball</div>
                  <QtyBuy
                    presets={[1, 5, 10, 25]}
                    max={999}
                    unitLabel="pacote"
                    buttonColor={color}
                    canBuyFn={(n) => bank.crystals >= 2000 * n}
                    onBuy={(n) => onBuyUltraBundle(n)}
                    disabledLabel="SEM CRISTAIS"
                  />
                </div>
              );
            })()}
            {(() => {
              const COST = 100;
              const owned = items.scroll_teleport ?? 0;
              const canBuy = bank.crystals >= COST;
              const color = "#8ec5ff";
              return (
                <div style={{
                  background: "linear-gradient(160deg, #0f1a2e 0%, #142238 100%)",
                  border: `1px solid ${color}77`, borderRadius: 12, padding: 14,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  boxShadow: `0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 ${color}22`,
                }}>
                  <img src={assetUrlFromJson(scrollTeleportUrl)} alt="" width={64} height={64}
                    style={{ filter: `drop-shadow(0 0 10px ${color}bb)` }} />
                  <div style={{ fontWeight: 800, color: "#eadfe8", fontSize: 14 }}>Pergaminho de Teleporte</div>
                  <div style={{ fontSize: 11, color: "#b8c8dc", textAlign: "center" }}>Teleporte instantâneo no Mapa Mundi — sem taxa de ouro, sem custo de cristais</div>
                  <div style={{ fontSize: 12, color, fontWeight: 700 }}>💎 {COST} cristais</div>
                  <div style={{ fontSize: 11, color: "#8aa0b8" }}>Você tem: {owned}</div>
                  <QtyBuy
                    presets={[1, 5, 10, 25]}
                    max={999}
                    unitLabel="pergaminho"
                    buttonColor={color}
                    canBuyFn={(n) => bank.crystals >= 100 * n}
                    onBuy={(n) => onBuyTeleportScroll(n)}
                    disabledLabel="SEM CRISTAIS"
                  />
                </div>
              );
            })()}
          </div>



          <h3 style={{ color: "#ff97e1", fontSize: 15, margin: "6px 0 10px" }}>🥚 Ovos — chocam Pokémon com raridade aleatória</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 20 }}>
            {shopEggs.map((e) => {
              const owned = items[e.id] ?? 0;
              const canBuy = e.currency === "gold" ? bank.gold >= e.price : bank.crystals >= e.price;
              return (
                <div key={e.id} style={{
                  background: "linear-gradient(160deg, #1a0f26 0%, #251638 100%)",
                  border: `1px solid ${e.color}77`, borderRadius: 12, padding: 14,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  boxShadow: `0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 ${e.color}22`,
                }}>
                  <div style={{
                    width: 72, height: 82, borderRadius: "45% / 55%",
                    background: `radial-gradient(circle at 30% 25%, #fff8, ${e.color} 55%, ${e.color}66 100%)`,
                    border: `2px solid ${e.color}`,
                    boxShadow: `0 0 14px ${e.color}88, inset 0 -6px 12px rgba(0,0,0,0.3)`,
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", top: 20, left: 12, right: 12, height: 3,
                      background: `${e.color}dd`, opacity: 0.6, borderRadius: 2, transform: "rotate(-8deg)",
                    }} />
                    <div style={{
                      position: "absolute", bottom: 12, right: 12, width: 6, height: 6,
                      background: "#fff", opacity: 0.4, borderRadius: "50%",
                    }} />
                  </div>
                  <div style={{ fontWeight: 800, color: "#eadfe8", fontSize: 14 }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: "#b8a8c8", textAlign: "center" }}>{e.desc}</div>
                  <div style={{ fontSize: 12, color: e.currency === "gold" ? "#f4c430" : "#c084fc", fontWeight: 700 }}>
                    {e.currency === "gold" ? `● ${e.price} ouro` : `💎 ${e.price} cristais`}
                  </div>
                  <div style={{ fontSize: 11, color: "#8a7a9c" }}>Você tem: {owned}</div>
                  <button
                    onClick={() => onBuyEgg(e)}
                    disabled={!canBuy}
                    style={{
                      width: "100%", padding: "8px 10px", fontWeight: 800, fontSize: 12,
                      background: canBuy ? e.color : "#3a2a4a", color: canBuy ? "#0b0510" : "#6a5a7c",
                      border: "none", borderRadius: 6, cursor: canBuy ? "pointer" : "not-allowed",
                    }}
                  >{canBuy ? "COMPRAR OVO" : e.currency === "gold" ? "SEM OURO" : "SEM CRISTAIS"}</button>
                </div>
              );
            })}
          </div>

          <h3 style={{ color: "#6bd4ff", fontSize: 15, margin: "6px 0 10px" }}>Amuletos</h3>
          <div style={{
            background: "linear-gradient(160deg, #0f1f2e 0%, #16324a 100%)",
            border: "1px solid #6bd4ff55", borderRadius: 12, padding: 14, marginBottom: 20,
            display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
          }}>
            <img src={assetUrlFromJson(chestAmuletImg)} alt="" width={64} height={64} style={{ imageRendering: "pixelated" }} />
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontWeight: 800, color: "#eadfe8" }}>Amuleto do Caçador de Tesouros</div>
              <div style={{ fontSize: 11, color: "#b8a8c8" }}>Dobra as recompensas de ouro e cristais ao abrir baús no mapa.</div>
              <div style={{ fontSize: 12, color: "#f4c430", fontWeight: 700 }}>● 250.000 ouro</div>
              <div style={{ fontSize: 11, color: "#8a7a9c" }}>Status: {chestAmuletOwned ? "Adquirido ✅" : "Não possuído ❌"}</div>
            </div>
            <button
              onClick={() => onBuyChestAmulet()}
              disabled={chestAmuletOwned > 0 || bank.gold < 250000}
              style={{
                minWidth: 140, padding: "10px 14px", fontWeight: 800, fontSize: 12,
                background: (chestAmuletOwned === 0 && bank.gold >= 250000) ? "#6bd4ff" : "#3a2a4a",
                color: (chestAmuletOwned === 0 && bank.gold >= 250000) ? "#0b0510" : "#6a5a7c",
                border: "none", borderRadius: 6, cursor: (chestAmuletOwned === 0 && bank.gold >= 250000) ? "pointer" : "not-allowed",
              }}
            >
              {chestAmuletOwned ? "JÁ POSSUI" : bank.gold < 250000 ? "SEM OURO" : "COMPRAR AMULETO"}
            </button>
          </div>
      )}

      {tab === "loja" && (
        <div>
          <h3 style={{ color: "#c084fc", fontSize: 15, margin: "6px 0 10px" }}>Livros de Habilidade — pagos em cristais 💎</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {SHOP_BOOKS.map((bk) => {
              const owned = items[bk.id] ?? 0;
              const useGold = bk.currency === "gold";
              const canBuy = useGold ? bank.gold >= bk.price : bank.crystals >= bk.price;
              const color = ITEM_COLORS[bk.id] ?? "#c084fc";
              return (
                <div key={bk.id} style={{
                  background: "linear-gradient(160deg, #1a0f26 0%, #251638 100%)",
                  border: `1px solid ${color}55`, borderRadius: 12, padding: 14,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  boxShadow: `0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 ${color}22`,
                }}>
                  <img src={assetUrlFromJson(bk.img)} alt="" width={64} height={64}
                    style={{ imageRendering: "pixelated", filter: `drop-shadow(0 0 8px ${color}88)` }} />
                  <div style={{ fontWeight: 800, color: "#eadfe8", fontSize: 13 }}>{bk.name}</div>
                  <div style={{ fontSize: 11, color: "#b8a8c8", textAlign: "center" }}>{bk.desc}</div>
                  <div style={{ fontSize: 12, color: useGold ? "#ffd94d" : "#c084fc", fontWeight: 700 }}>{useGold ? "🪙" : "💎"} {bk.price}</div>
                  <div style={{ fontSize: 11, color: "#8a7a9c" }}>Você tem: {owned}</div>
                  <QtyBuy
                    presets={[1, 10, 50, 100]}
                    max={9999}
                    unitLabel={bk.name}
                    buttonColor={color}
                    canBuyFn={(n) => (useGold ? bank.gold >= bk.price * n : bank.crystals >= bk.price * n) && (!bk.priceGold || bank.gold >= bk.priceGold * n)}
                    onBuy={(n) => onBuyBook(bk, n)}
                    disabledLabel={useGold ? "SEM OURO" : "SEM CRISTAL"}
                  />

                </div>
              );
            })}
          </div>

          {/* ═══ Trocador NPC — Orbs de XP por Pokémon capturados ═══ */}
          <h3 style={{ color: "#ffd94d", fontSize: 15, margin: "22px 0 6px" }}>
            🧙 Trocador NPC — Orbs de XP
          </h3>
          <div style={{ color: "#b8a8c8", fontSize: 11, marginBottom: 10, lineHeight: 1.5 }}>
            O NPC aceita Pokémon da sua <b>Coleção</b> (não da equipe) em troca de Orbs mais fortes.
            <b style={{ color: "#ffd94d" }}> Você escolhe</b> quais Pokémon entregar.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {orbTrades.map((t) => {
              const available = collection.filter((c) =>
                (c.rarity === t.rarity || (t.rarity === "mythic" && c.rarity === "mythic_shiny"))
                && !teamUidSet.has(c.uid)
                && !benchUids.has(c.uid)
                && !lockedSet.has(c.uid),
              ).length;
              const reqOk = !t.requires || (items[t.requires.itemId] ?? 0) >= t.requires.qty;
              const reqOwned = t.requires ? (items[t.requires.itemId] ?? 0) : 0;
              const canTrade = available >= t.count && reqOk;
              const owned = items[t.orbId] ?? 0;
              return (
                <div key={`${t.orbId}-${t.rarity}`} style={{
                  background: "linear-gradient(160deg, #1a0f26 0%, #251638 100%)",
                  border: `1px solid ${t.color}55`, borderRadius: 12, padding: 14,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  boxShadow: `0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 ${t.color}22`,
                }}>
                  <img src={assetUrlFromJson(t.img)} alt="" width={64} height={64}
                    style={{ imageRendering: "pixelated", filter: `drop-shadow(0 0 10px ${t.color}aa)` }} />
                  <div style={{ fontWeight: 800, color: "#eadfe8", fontSize: 13 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: "#b8a8c8", textAlign: "center" }}>{t.desc}</div>
                  <div style={{ fontSize: 11, color: canTrade ? "#8ae28a" : "#e28a8a" }}>
                    Coleção {t.rarity.toUpperCase()}: {available} (precisa {t.count})
                  </div>
                  {t.requires && (
                    <div style={{ fontSize: 10, fontWeight: 800, color: reqOk ? "#8ae28a" : "#ff9a6b", background: reqOk ? "#0f2018" : "#2a1620", border: `1px solid ${reqOk ? "#8ae28a55" : "#ff9a6b55"}`, borderRadius: 6, padding: "3px 8px", textAlign: "center" }}>
                      {reqOk ? "✓" : "🔒"} Requer {t.requires.qty}× {t.requires.label} ({reqOwned}/{t.requires.qty})
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "#8a7a9c" }}>Você tem: {owned}</div>
                  <button
                    disabled={!canTrade}
                    onClick={() => {
                      setOrbPicker({ orbId: t.orbId, rarity: t.rarity, count: t.count, color: t.color, label: t.label });
                      setOrbPickerSel(new Set());
                    }}
                    style={{
                      width: "100%", padding: "8px 10px", fontWeight: 800,
                      background: canTrade ? t.color : "#3a2a4a",
                      color: canTrade ? "#0b0510" : "#6a5a7c",
                      border: "none", borderRadius: 6,
                      cursor: canTrade ? "pointer" : "not-allowed",
                    }}
                  >{!reqOk ? `FORJE 1 ${t.requires!.label.toUpperCase()} PRIMEIRO` : canTrade ? "ESCOLHER POKÉMON" : `PRECISA DE ${t.count} ${t.rarity.toUpperCase()}`}</button>
                </div>
              );
            })}
          </div>

          {orbPicker && (() => {
            const op = orbPicker as NonNullable<typeof orbPicker>;
            // Exclui Pokémon do time e travados — evita "não consome / orb infinito"
            // quando o jogador tenta trocar um Pokémon que está em uso.
            const eligible = collection.filter((c) =>
              (c.rarity === op.rarity || (op.rarity === "mythic" && c.rarity === "mythic_shiny")) && !teamUidSet.has(c.uid) && !benchUids.has(c.uid) && !lockedSet.has(c.uid),
            );
            const selCount = orbPickerSel.size;
            const canConfirm = selCount === op.count;
            return (
              <div
                onClick={() => setOrbPicker(null)}
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", zIndex: 10000, display: "grid", placeItems: "center", padding: 16 }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: "min(560px, 100%)", maxHeight: "88vh", overflowY: "auto",
                    background: "linear-gradient(180deg,#1c0f2e,#0b0510)",
                    border: `2px solid ${op.color}`, borderRadius: 14, padding: 16,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.7), 0 0 20px ${op.color}55`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontWeight: 900, color: op.color, fontSize: 15 }}>
                      🧙 Escolha {op.count} Pokémon {op.rarity.toUpperCase()}
                    </div>
                    <button onClick={() => setOrbPicker(null)} style={{ background: "transparent", border: "none", color: "#eadfe8", cursor: "pointer", fontSize: 18 }}>✕</button>
                  </div>
                  <div style={{ fontSize: 11, color: "#b8a8c8", marginBottom: 10 }}>
                    Selecionados: <b style={{ color: canConfirm ? "#8ae28a" : "#ffd94d" }}>{selCount}/{op.count}</b> — Recompensa: <b>{op.label}</b>
                  </div>
                  {eligible.length === 0 ? (
                    <div style={{ color: "#e28a8a", fontSize: 12, padding: 20, textAlign: "center" }}>
                      Você não tem Pokémon {op.rarity.toUpperCase()} na coleção.
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 8 }}>
                      {eligible.map((c) => {
                        const sel = orbPickerSel.has(c.uid);
                        const disabled = !sel && selCount >= op.count;
                        return (
                          <button
                            key={c.uid}
                            disabled={disabled}
                            onClick={() => {
                              setOrbPickerSel((prev) => {
                                const next = new Set(prev);
                                if (next.has(c.uid)) next.delete(c.uid); else next.add(c.uid);
                                return next;
                              });
                            }}
                            style={{
                              background: sel ? `linear-gradient(160deg, ${op.color}55, ${op.color}22)` : "#1a0f26",
                              border: sel ? `2px solid ${op.color}` : "2px solid #3a2a4a",
                              borderRadius: 10, padding: 6, cursor: disabled ? "not-allowed" : "pointer",
                              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                              opacity: disabled ? 0.4 : 1, position: "relative",
                            }}
                          >
                            {gifMap[c.species] ? (
                              <img src={assetUrlFromJson(gifMap[c.species])} alt="" style={{ width: 54, height: 54, imageRendering: "pixelated" }} />
                            ) : (
                              <div style={{ width: 54, height: 54, background: "#2a1638", borderRadius: 8 }} />
                            )}
                            <div style={{ fontSize: 10, color: "#eadfe8", fontWeight: 700, textTransform: "capitalize" }}>{c.species.replace(/_/g, " ")}</div>
                            <div style={{ fontSize: 10, color: "#ffd94d" }}>Lv.{c.level}</div>
                            {sel && (
                              <div style={{
                                position: "absolute", top: 2, right: 2, background: op.color, color: "#0b0510",
                                width: 18, height: 18, borderRadius: 999, fontSize: 11, fontWeight: 900, display: "grid", placeItems: "center",
                              }}>✓</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                      onClick={() => setOrbPicker(null)}
                      style={{ flex: 1, padding: "10px", background: "#3a2a4a", color: "#eadfe8", border: "none", borderRadius: 8, fontWeight: 800, cursor: "pointer" }}
                    >CANCELAR</button>
                    <button
                      disabled={!canConfirm}
                      onClick={(e) => {
                        const btn = e.currentTarget;
                        if (btn.dataset.busy === "1") return;
                        btn.dataset.busy = "1";
                        btn.disabled = true;
                        const uids = Array.from(orbPickerSel);
                        setOrbPicker(null);
                        setOrbPickerSel(new Set());
                        onTradeOrb(op.orbId, uids, [], op.rarity);
                      }}
                      style={{
                        flex: 2, padding: "10px", fontWeight: 900,
                        background: canConfirm ? op.color : "#3a2a4a",
                        color: canConfirm ? "#0b0510" : "#6a5a7c",
                        border: "none", borderRadius: 8, cursor: canConfirm ? "pointer" : "not-allowed",
                      }}
                    >CONFIRMAR TROCA</button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}


      {tab === "melhorias" && (() => {
        const nowMs = Date.now();
        const bookActive = !!(idle.buffs?.expMultUntil && nowMs < idle.buffs.expMultUntil);
        const orbActive = !!(idle.buffs?.orbUntil && nowMs < idle.buffs.orbUntil);
        const honeyActive = !!(idle.buffs?.honeyUntil && nowMs < idle.buffs.honeyUntil);
        const honeyRareActive = !!(idle.buffs?.honeyRareUntil && nowMs < idle.buffs.honeyRareUntil);
        const bookPct = bookActive ? Math.round((idle.buffs?.expMult ?? 0) * 100) : 0;
        const orbPct = orbActive ? Math.round((idle.buffs?.orbMult ?? 0) * 100) : 0;
        const honeyPct = honeyRareActive ? 20 : honeyActive ? 10 : 0;
        const totalExpPct = bookPct + orbPct + honeyPct;
        const stats = idle.globalStats || { attack: 0, speed: 0, synergy: 0, resistance: 0, mastery: 0 };
        const stonesMap: Record<keyof typeof stats, { stone: string, color: string, label: string, desc: string, fail: number }> = {
          attack: { stone: "stone_fire", color: "#ff5252", label: "ATAQUE", desc: "Aumenta o Dano Total em +5% por nível. Essencial para derrotar Chefes e lendários mais rápido.", fail: 15 },
          speed: { stone: "stone_electric", color: "#ffd94d", label: "VELO", desc: "Reduz o intervalo de ataque em -0.05s. Quanto mais rápido, mais vezes você ataca por segundo.", fail: 12 },
          synergy: { stone: "stone_grass", color: "#c084fc", label: "SINERG", desc: "Melhora o bônus de tipo do time em +2%. Fortalece a harmonia entre seus Pokémon.", fail: 20 },
          resistance: { stone: "stone_water", color: "#4a7bff", label: "RESIST", desc: "Reduz o dano recebido em -3%. Permite que você aguente batalhas contra Pokémon de nível alto.", fail: 10 },
          mastery: { stone: "stone_dragon", color: "#5ec26a", label: "MASTER", desc: "Aumenta Chance Crítica e Dano Elemental em +1.5%. Maximiza o potencial explosivo do time.", fail: 25 },
        };
        const radarPoints = [
          { label: stonesMap.attack.label, val: 20 + (stats.attack ?? 0) * 8, color: stonesMap.attack.color, key: "attack" as const },
          { label: stonesMap.speed.label, val: 20 + (stats.speed ?? 0) * 8, color: stonesMap.speed.color, key: "speed" as const },
          { label: stonesMap.synergy.label, val: 20 + (stats.synergy ?? 0) * 8, color: stonesMap.synergy.color, key: "synergy" as const },
          { label: stonesMap.resistance.label, val: 20 + (stats.resistance ?? 0) * 8, color: stonesMap.resistance.color, key: "resistance" as const },
          { label: stonesMap.mastery.label, val: 20 + (stats.mastery ?? 0) * 8, color: stonesMap.mastery.color, key: "mastery" as const },
        ];
        const getPolyPoints = (scale = 1) => {
          return radarPoints.map((p, i) => {
            const angle = (i * 2 * Math.PI) / radarPoints.length - Math.PI / 2;
            const r = (Math.min(100, p.val) / 100) * 80 * scale;
            return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
          }).join(" ");
        };
        const upgradeStat = (key: keyof typeof stats) => {
          const curLv = stats[key] ?? 0;
          const config = stonesMap[key];
          const stoneCost = 50 + curLv * 25;
          const bookCost = 1 + Math.floor(curLv / 2);
          const hasStones = (idle.items[config.stone] ?? 0) >= stoneCost;
          const hasBooks = (idle.items.book_atk ?? 0) >= bookCost && (idle.items.book_def ?? 0) >= bookCost;
          if (!hasStones || !hasBooks) {
            pushChat(`Falta: ${stoneCost}x ${config.stone.replace("stone_","").toUpperCase()} e ${bookCost}x Livros.`, "info");
            return;
          }
          if (Math.random() * 100 < config.fail) {
            setIdle((s: any) => {
              const ni = { ...s.items }; ni[config.stone] = (ni[config.stone] ?? 0) - Math.floor(stoneCost/2);
              return { ...s, items: ni };
            });
            pushChat(`❌ FALHA! Perdido: ${Math.floor(stoneCost/2)}x Stones.`, "info");
            return;
          }
          setIdle((s: any) => {
            const ni = { ...s.items };
            ni[config.stone] = (ni[config.stone] ?? 0) - stoneCost;
            ni.book_atk = (ni.book_atk ?? 0) - bookCost;
            ni.book_def = (ni.book_def ?? 0) - bookCost;
            return { ...s, items: ni, globalStats: { ...stats, [key]: curLv + 1 } };
          });
          pushChat(`✨ Evoluiu ${config.label} para Nível ${curLv + 1}!`, "cap");
        };

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center", background: "rgba(20,15,35,0.8)", padding: 20, borderRadius: 16, border: "2px solid #f5cf6b33" }}>
              <div style={{ flex: "0 0 200px", position: "relative" }}>
                <svg width="200" height="200" viewBox="0 0 200 200" style={{ filter: "drop-shadow(0 0 10px rgba(245,207,107,0.2))" }}>
                  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(245,207,107,0.1)" strokeWidth="1" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(245,207,107,0.1)" strokeWidth="1" />
                  <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(245,207,107,0.1)" strokeWidth="1" />
                  {radarPoints.map((_, i) => {
                    const angle = (i * 2 * Math.PI) / radarPoints.length - Math.PI / 2;
                    return <line key={i} x1="100" y1="100" x2={100 + 80 * Math.cos(angle)} y2={100 + 80 * Math.sin(angle)} stroke="rgba(245,207,107,0.2)" strokeWidth="1" />;
                  })}
                  <polygon points={getPolyPoints()} fill="rgba(245,207,107,0.3)" stroke="#f5cf6b" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                  {radarPoints.map((p, i) => {
                    const angle = (i * 2 * Math.PI) / radarPoints.length - Math.PI / 2;
                    return (
                      <div key={i} style={{
                        position: "absolute",
                        left: 100 + 95 * Math.cos(angle),
                        top: 100 + 95 * Math.sin(angle),
                        transform: "translate(-50%, -50%)",
                        fontSize: 9, fontWeight: 900, color: p.color, textShadow: "0 1px 2px #000"
                      }}>{p.label}</div>
                    );
                  })}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <h3 style={{ color: "#f5cf6b", margin: "0 0 4px 0", fontSize: 18, letterSpacing: 1, textShadow: "0 2px 4px #000" }}>ANATOMIA DA CONTA</h3>
                <p style={{ fontSize: 10, color: "#a8a0b8", margin: "0 0 12px 0", lineHeight: 1.4 }}>
                  Evolua os atributos permanentes da sua conta gastando <strong>Stones Elementais</strong> e <strong>Livros</strong>. Cada melhoria ajuda no seu progresso global.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                  {radarPoints.map(p => {
                    const k = p.key;
                    const cfg = stonesMap[k];
                    return (
                      <div key={p.key} style={{ background: "#1a0f26", border: "1px solid #3a2e58", borderRadius: 10, padding: "8px 12px", display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ width: 36, height: 36, background: "#000", borderRadius: 8, display: "grid", placeItems: "center", border: `1px solid ${cfg.color}44` }}>
                          <img src={assetUrlFromJson(STONE_CHEST[cfg.stone])} alt="" style={{ width: 28, height: 28, imageRendering: "pixelated" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                            <span style={{ fontSize: 10, color: cfg.color, fontWeight: 900 }}>{p.label} <span style={{ color: "#a8a0b8", fontSize: 9 }}>Lv.{stats[k] ?? 0}</span></span>
                            <span style={{ fontSize: 9, color: "#ff5252", fontWeight: 700 }}>Falha: {cfg.fail}%</span>
                          </div>
                          <div style={{ fontSize: 9, color: "#eadfe8", marginBottom: 4, opacity: 0.8 }}>{cfg.desc}</div>
                          <button 
                            onClick={() => upgradeStat(k)}
                            style={{ width: "100%", padding: "4px", background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}aa)`, border: "none", borderRadius: 4, fontSize: 10, fontWeight: 900, cursor: "pointer", color: "#000" }}
                          >MELHORAR (Custo: 50+ Stones)</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>


            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <BuffCell img={bookAtkImg} label="Ataque" value={`+${Math.round((((idle.buffs?.atk ?? 0)) + ((stats.attack ?? 0) * 0.05)) * 100)}%`} color="#ff5252" />
              <BuffCell img={bookDefImg} label="Defesa" value={`-${Math.round((((idle.buffs?.def ?? 0)) + ((stats.resistance ?? 0) * 0.03)) * 100)}%`} color="#4a7bff" />
              <BuffCell img={bookExpImg} label="EXP TOTAL" value={`+${totalExpPct}%`} color="#5ec26a" />
            </div>

            <div style={{ position: "relative", width: "100%", height: "180px", background: "rgba(0,0,0,0.5)", borderRadius: 16, border: "2px solid #b9a7ff44", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 0 20px rgba(185, 167, 255, 0.15)" }}>
              <img 
                src={assetUrlFromJson(rayquazaShinyBg)} 
                alt="Rayquaza Shiny" 
                style={{ 
                  maxWidth: "95%", 
                  maxHeight: "95%", 
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 15px rgba(185, 167, 255, 0.5))"
                }} 
              />
              <div style={{ 
                position: "absolute", 
                bottom: 12, 
                right: 18, 
                fontSize: 10, 
                fontWeight: 900, 
                color: "#b9a7ff", 
                textShadow: "0 2px 4px #000",
                letterSpacing: 1.5,
                background: "rgba(0,0,0,0.6)",
                padding: "2px 8px",
                borderRadius: 4,
                border: "1px solid #b9a7ff33"
              }}>
                ✦ BLACK MITIC PLUS LEGENDARY ✦
              </div>
            </div>
          </div>
        );
      })()}


      {tab === "inicio" && (
        <div style={{ color: "#c8b8d0", fontSize: 13, lineHeight: 1.6 }}>
          <p style={{ marginTop: 0 }}>Bem-vindo ao <strong style={{ color: "#f5cf6b" }}>Modo Idle</strong>!</p>
          <ul style={{ paddingLeft: 20 }}>
            <li>Seus Pokémon batalham automaticamente.</li>
            <li>Ache <strong>baús</strong> pelo mapa — dão ouro extra.</li>
            <li>Compre <strong>Pokébolas</strong> na Loja para capturar Pokémon.</li>
            <li>Use <strong>Livros</strong> pra ficar mais forte.</li>
            <li>Novos Pokémon aparecem conforme seu nível sobe.</li>
          </ul>

          <h3 style={{ color: "#f5cf6b", fontSize: 14, margin: "18px 0 10px" }}>
            Escolher Skin <span style={{ fontSize: 11, color: "#b9a7ff" }}>· 🎟️ Tickets: {skinTickets}</span>
          </h3>
          <div style={{ fontSize: 11, color: "#b9a7ff", marginBottom: 8 }}>
            Skins premium ficam bloqueadas. Abra a <strong>Caixa Premium ✦</strong> na Mochila para ganhar Tickets e desbloquear a skin que quiser.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
            {SKINS.map((s) => {
              const active = s.id === skinId;
              const unlocked = unlockedSkins.includes(s.id);
              const canUnlock = !unlocked && skinTickets > 0;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    if (unlocked) { setSkinId(s.id); return; }
                    if (canUnlock) {
                      if (window.confirm(`Desbloquear a skin "${s.label}" usando 1 Ticket de Skin ✦?`)) {
                        onUnlockSkin(s.id);
                      }
                    }
                  }}
                  disabled={!unlocked && !canUnlock}
                  style={{
                    position: "relative",
                    background: active ? "linear-gradient(160deg,#3a1f5c,#6b3fb0)" : unlocked ? "#1a0f26" : "#120a1c",
                    border: `2px solid ${active ? "#f5cf6b" : unlocked ? "rgba(107,212,255,0.35)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 10, padding: 10,
                    cursor: unlocked ? "pointer" : canUnlock ? "pointer" : "not-allowed",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    color: unlocked ? "#eadfe8" : "#7a6f8a", fontFamily: "inherit",
                    boxShadow: active ? "0 0 18px rgba(245,207,107,0.45)" : "none",
                    opacity: unlocked ? 1 : 0.85,
                  }}
                >
                  <div style={{
                    width: 72, height: 72, display: "grid", placeItems: "center",
                    background: "rgba(0,0,0,0.35)", borderRadius: 8,
                    imageRendering: "pixelated",
                    filter: unlocked ? "none" : "grayscale(1) brightness(0.55)",
                  }}>
                    {s.url ? (
                      <img src={assetUrlFromJson(s.url)} alt={s.label} style={{ maxWidth: "100%", maxHeight: "100%", imageRendering: "pixelated" }} />
                    ) : (
                      <div style={{ fontSize: 32 }}>🧢</div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, textAlign: "center" }}>{s.label}</div>
                  {active && <div style={{ fontSize: 9, color: "#f5cf6b" }}>✓ EM USO</div>}
                  {!unlocked && (
                    <div style={{ fontSize: 9, color: canUnlock ? "#f5cf6b" : "#8a7fa0", fontWeight: 700 }}>
                      {canUnlock ? "🎟️ USAR TICKET" : "🔒 BLOQUEADA"}
                    </div>
                  )}
                  {!unlocked && (
                    <div style={{ position: "absolute", top: 6, right: 6, fontSize: 14 }}>🔒</div>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      )}

      {tab === "wallet" && (
        <WalletScreen 
          bank={bank} 
          items={items}
          collection={collection}
          gifMap={gifMap}
          onOpenColecaoDetail={onOpenColecaoDetail}
          onExchange={onExchange} 
        />
      )}

      {tab === "market" && (
        <div style={{ minHeight: 320, display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
          <div>
            <div style={{ fontSize: 54, filter: "grayscale(1)", opacity: 0.7 }}>🔒</div>
            <div style={{ marginTop: 12, color: "#f5cf6b", fontSize: 20, fontWeight: 900 }}>MERCADO BLOQUEADO</div>
            <div style={{ marginTop: 8, color: "#c8b8d0", fontSize: 13 }}>Este sistema está temporariamente indisponível.</div>
          </div>
      )}




      {tab === "config" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520 }}>
          <div style={{ color: "#c8b8d0", fontSize: 13, lineHeight: 1.5 }}>
            Ajuste os sons e a música do jogo. A música toca em loop de fundo enquanto você joga.
          </div>

          <div style={{
            background: "linear-gradient(160deg, #1a0f26, #251638)",
            border: "1px solid rgba(107,212,255,0.35)", borderRadius: 12, padding: 16,
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={audioSettings.music}
                onChange={(e) => setAudioSettings((s) => ({ ...s, music: e.target.checked }))}
                style={{ width: 18, height: 18 }} />
              <span style={{ color: "#eadfe8", fontWeight: 700 }}>🎵 Música de fundo</span>
            </label>
            <div>
              <div style={{ fontSize: 11, color: "#b8a8c8", marginBottom: 4 }}>Volume da música: {Math.round(audioSettings.musicVol * 100)}%</div>
              <input type="range" min={0} max={1} step={0.05} value={audioSettings.musicVol}
                onChange={(e) => setAudioSettings((s) => ({ ...s, musicVol: Number(e.target.value) }))}
                style={{ width: "100%" }} />
            </div>
          </div>

          <div style={{
            background: "linear-gradient(160deg, #1a0f26, #251638)",
            border: "1px solid rgba(245,207,107,0.35)", borderRadius: 12, padding: 16,
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={audioSettings.sfx}
                onChange={(e) => setAudioSettings((s) => ({ ...s, sfx: e.target.checked }))}
                style={{ width: 18, height: 18 }} />
              <span style={{ color: "#eadfe8", fontWeight: 700 }}>🔊 Efeitos sonoros (clique, level-up, capturas)</span>
            </label>
            <div>
              <div style={{ fontSize: 11, color: "#b8a8c8", marginBottom: 4 }}>Volume dos efeitos: {Math.round(audioSettings.sfxVol * 100)}%</div>
              <input type="range" min={0} max={1} step={0.05} value={audioSettings.sfxVol}
                onChange={(e) => setAudioSettings((s) => ({ ...s, sfxVol: Number(e.target.value) }))}
                style={{ width: "100%" }} />
            </div>
          </div>

<div style={{ background: "linear-gradient(160deg, #0f1f2e, #16324a)", border: "1px solid rgba(107,212,255,0.4)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={autoHeal.enabled}
                onChange={(e) => setAutoHeal({ ...autoHeal, enabled: e.target.checked })}
                style={{ width: 18, height: 18 }} />
              <span style={{ color: "#eadfe8", fontWeight: 700 }}>🧪 Auto-Poção no modo Auto</span>
            </label>
            <div>
              <div style={{ fontSize: 11, color: "#b8a8c8", marginBottom: 4 }}>
                Usar poção quando HP &lt;= {Math.round(autoHeal.threshold * 100)}% (você tem {items.potion ?? 0} poção)
              </div>
              <input type="range" min={0.1} max={0.9} step={0.05} value={autoHeal.threshold}
                onChange={(e) => setAutoHeal({ ...autoHeal, threshold: Number(e.target.value) })}
                style={{ width: "100%" }} />
            </div>
            <div style={{ fontSize: 11, color: "#8a7a9c" }}>
              Cada poção custa {POTION_PRICE} ouro na Loja e recupera {Math.round(POTION_HEAL_PCT * 100)}% de HP.
            </div>
          </div>

          <div style={{ fontSize: 11, color: "#8a7a9c" }}>
            Se a música não iniciar automaticamente, clique em qualquer lugar da tela — os navegadores exigem uma interação antes de tocar áudio.
          </div>
      )}

      {statsCardPet && (
        <PokemonStatsCard pet={statsCardPet} team={team} gifSrc={gifMap[statsCardPet.species]} onClose={() => setStatsCardPet(null)} />
      )}

      {fragConfirm && (() => {
        const rarityColor: Partial<Record<Rarity, string>> = {
          common: "#8b6a30", uncommon: "#5ec26a", rare: "#4a9eff",
          epic: "#c084fc", legendary: "#ff8b3d", mythic: "#ff5252", mythic_shiny: "#ffd94d",
        };
        const list = fragConfirm.entries;
        const isBulk = list.length > 1;
        return (
          <div
            onClick={() => setFragConfirm(null)}
            style={{ position: "fixed", inset: 0, zIndex: 10001, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 16 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(560px, 100%)", maxHeight: "88vh", overflowY: "auto",
                background: "linear-gradient(160deg, #2a0f4a 0%, #1a0526 55%, #0b0510 100%)",
                border: "3px solid #a78bfa",
                borderRadius: 18,
                boxShadow: "0 20px 60px rgba(0,0,0,0.85), 0 0 40px rgba(167,139,250,0.55), inset 0 1px 0 rgba(255,255,255,0.1)",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(circle at 50% 10%, rgba(196,181,253,0.28), transparent 55%)",
              }} />
              <div style={{
                padding: "16px 18px", display: "flex", alignItems: "center", gap: 14,
                borderBottom: "2px solid rgba(167,139,250,0.35)", position: "relative",
              }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 56, height: 56, borderRadius: "50%",
                  background: "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.5), rgba(196,181,253,0.15) 55%, transparent 75%)",
                  boxShadow: "0 0 18px rgba(233,213,255,0.9), inset 0 0 10px rgba(124,58,237,0.4)",
                }}>
                  <img src={assetUrlFromJson(iconFragmentCrystal)} alt="" width={44} height={44}
                    style={{ imageRendering: "pixelated", filter: "drop-shadow(0 0 6px rgba(233,213,255,0.9))" }} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#f7ecf7", letterSpacing: 2, textShadow: "0 2px 0 #000" }}>
                    ⚒️ FRAGMENTAR {isBulk ? `${list.length} POKÉMON` : "POKÉMON"}
                  </div>
                  <div style={{ fontSize: 11, color: "#c8b8d0", marginTop: 2, fontStyle: "italic" }}>
                    Ação permanente — converte em pontos de craft.
                  </div>
                </div>
                <button onClick={() => setFragConfirm(null)} style={{
                  width: 32, height: 32, borderRadius: 8, border: "1px solid #6a5a7c",
                  background: "#2a1638", color: "#f7ecf7", fontSize: 16, fontWeight: 900, cursor: "pointer",
                }}>✕</button>
              </div>

              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isBulk ? "repeat(auto-fill, minmax(120px, 1fr))" : "1fr",
                  gap: 10, maxHeight: 320, overflowY: "auto", padding: 4,
                }}>
                  {list.map((e) => {
                    const rc = rarityColor[e.rarity] ?? "#8b6a30";
                    return (
                      <div key={e.uid} style={{
                        background: "linear-gradient(180deg, rgba(30,15,50,0.85), rgba(11,5,16,0.9))",
                        border: `2px solid ${rc}88`,
                        borderRadius: 12, padding: 10, textAlign: "center",
                        boxShadow: `inset 0 0 12px ${rc}33, 0 2px 8px rgba(0,0,0,0.4)`,
                      }}>
                        {gifMap[e.species] && (
                          <img src={assetUrlFromJson(gifMap[e.species])} alt="" style={{ width: 56, height: 56, imageRendering: "pixelated" }} />
                        )}
                        <div style={{ fontSize: 10, fontWeight: 900, color: "#f7ecf7", letterSpacing: 1, marginTop: 2 }}>
                          {e.species.replace(/_/g, " ").toUpperCase()}
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 8, background: rc, color: "#0b0510", fontWeight: 900, letterSpacing: 1 }}>
                            {e.rarity.toUpperCase()}
                          </span>
                          <span style={{ fontSize: 9, color: "#f5cf6b", fontWeight: 900 }}>Lv {e.level}</span>
                        </div>
                        <div style={{
                          marginTop: 6, fontSize: 11, fontWeight: 900,
                          color: "#e9d5ff", letterSpacing: 0.5,
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                        }}>
                          <img src={assetUrlFromJson(iconFragmentCrystal)} alt="" width={16} height={16} style={{ imageRendering: "pixelated" }} />
                          +{e.gain}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{
                  marginTop: 4, padding: "12px 14px", borderRadius: 12,
                  background: "linear-gradient(90deg, rgba(139,92,246,0.25), rgba(196,181,253,0.15), rgba(139,92,246,0.25))",
                  border: "1.5px solid #a78bfa88",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: "#c8b8d0", letterSpacing: 2 }}>GANHO TOTAL</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img src={assetUrlFromJson(iconFragmentCrystal)} alt="" width={26} height={26}
                      style={{ imageRendering: "pixelated", filter: "drop-shadow(0 0 6px rgba(233,213,255,0.9))" }} />
                    <span style={{
                      fontSize: 26, fontWeight: 900, fontFamily: "monospace",
                      background: "linear-gradient(180deg, #f5d0fe, #a78bfa)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>+{fragConfirm.totalGain}</span>
                    <span style={{ fontSize: 10, color: "#c8b8d0", fontWeight: 800, letterSpacing: 1 }}>PTS CRAFT</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button
                    onClick={() => setFragConfirm(null)}
                    style={{
                      flex: 1, padding: "12px 14px", fontSize: 12, fontWeight: 900, letterSpacing: 1,
                      background: "linear-gradient(180deg, #3a2450, #241634)", color: "#eadfe8",
                      border: "1px solid #5a3d78", borderRadius: 10, cursor: "pointer",
                    }}
                  >CANCELAR</button>
                  <button
                    onClick={confirmFrag}
                    style={{
                      flex: 1.4, padding: "12px 14px", fontSize: 13, fontWeight: 900, letterSpacing: 1,
                      background: "linear-gradient(180deg,#c4b5fd 0%,#8b5cf6 45%,#5b21b6 100%)",
                      color: "#fff",
                      border: "1px solid #3b0f7a", borderRadius: 10, cursor: "pointer",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 16px rgba(167,139,250,0.75)",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}
                  >⚒️ CONFIRMAR</button>
                </div>
              </div>
            </div>
          </div>
        );

function BuffCell({ img, label, value, color }: { img: any; label: string; value: string; color: string }) {
  return (
    <div style={{
      background: "#1a0f26", border: `1px solid ${color}55`, borderRadius: 10,
      padding: 12, textAlign: "center",
    }}>
      <img src={assetUrlFromJson(img)} alt="" width={40} height={40} style={{ imageRendering: "pixelated" }} />
      <div style={{ fontSize: 12, color: "#c8b8d0", marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

// ============ BANCO MEDIEVAL (câmbio e resgate) ============
function WalletScreen({
  bank,
  items,
  collection,
  gifMap,
  onOpenColecaoDetail,
  onExchange
}: {
  bank: { gold: number; crystals: number };
  items: Record<string, number>;
  collection: CollectionEntry[];
  gifMap: Partial<Record<Species, string>>;
  onOpenColecaoDetail: (uid: string) => void;
  onExchange: (dir: "g2c" | "c2g", amount: number) => void;
}) {
  const [buyAmt, setBuyAmt] = useState(1);
  const [sellAmt, setSellAmt] = useState(1);
  const [activeView, setActiveView] = useState<"cambio" | "itens" | "pokemon">("cambio");

  const buyCost = buyAmt * 1000;
  const sellGain = sellAmt * 800;

  const ITEM_NAMES: Record<string, string> = {
    potion: "Poção", pokeball: "Pokébola", greatball: "Great Ball", ultraball: "Ultra Ball",
    stone_grass: "Stone Verdejante 🌿", stone_fire: "Stone Ígnea 🔥", stone_water: "Stone Aquática 💧",
    stone_electric: "Stone Elétrica ⚡", stone_dark: "Stone Sombria 🌑", stone_dragon: "Stone Dragão 🐉",
    egg_common: "Ovo Comum", egg_rare: "Ovo Raro", egg_epic: "Ovo Épico", egg_mystic: "Ovo Místico",
    black_mitic_egg: "Black Mitic Egg ✦", premium_box: "Caixa Premium ✦"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 780 }}>
      {/* Header do Banco */}
      <div style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        border: "2px solid #f5cf6b66",
        boxShadow: "0 8px 24px rgba(0,0,0,0.55), inset 0 0 40px rgba(0,0,0,0.4)",
        backgroundImage: `url(${assetUrlFromJson(walletHero)})`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        minHeight: 160,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(11,5,16,0.15) 0%, rgba(11,5,16,0.55) 55%, rgba(11,5,16,0.95) 100%)",
        }} />
        <div style={{ position: "relative", padding: "16px 18px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10 }}>
          <div>
            <div style={{ color: "#ffe58a", fontWeight: 900, fontSize: 22, letterSpacing: 2, textShadow: "2px 2px 0 #000, 0 0 12px #f5cf6b66" }}>✦ BANCO MEDIEVAL</div>
            <div style={{ color: "#dcc8e0", fontSize: 12, marginTop: 3, textShadow: "1px 1px 0 #000" }}>Gerencie seus bens e visualize suas reservas no cofre real.</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ background: "rgba(14,8,24,0.85)", backdropFilter: "blur(4px)", border: "1px solid #f5cf6b88", borderRadius: 8, padding: "6px 12px", color: "#f5cf6b", fontWeight: 800 }}>💰 {bank.gold.toLocaleString()}</div>
            <div style={{ background: "rgba(14,8,24,0.85)", backdropFilter: "blur(4px)", border: "1px solid #8fd0ff88", borderRadius: 8, padding: "6px 12px", color: "#8fd0ff", fontWeight: 800 }}>💎 {bank.crystals.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Navegação Interna */}
      <div style={{ display: "flex", gap: 8 }}>
        {(["cambio", "itens", "pokemon"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setActiveView(v)}
            style={{
              flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #f5cf6b44",
              background: activeView === v ? "linear-gradient(180deg, #f5cf6b, #b8862a)" : "#1a0f26",
              color: activeView === v ? "#0e0818" : "#f5cf6b",
              fontWeight: 900, cursor: "pointer", fontSize: 12, transition: "0.2s"
            }}
          >
            {v === "cambio" ? "🪙 CÂMBIO" : v === "itens" ? "🎒 ITENS GUARDADOS" : "🐉 POKÉMON NO COFRE"}
          </button>
        ))}
      </div>

      <div style={{ background: "rgba(14,8,24,0.4)", borderRadius: 12, padding: 2, minHeight: 300 }}>
        {activeView === "cambio" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: 12 }}>
            <div style={{ background: "#1a0f26", border: "1px solid #8fd0ff55", borderRadius: 10, padding: 14 }}>
              <div style={{ color: "#8fd0ff", fontWeight: 800, marginBottom: 6 }}>Comprar 💎</div>
              <input type="number" min={1} value={buyAmt} onChange={(e) => setBuyAmt(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: "100%", background: "#0e0818", color: "#f3e5c5", border: "1px solid #8fd0ff55", borderRadius: 6, padding: 8 }} />
              <div style={{ fontSize: 12, color: "#c8b8d0", margin: "8px 0" }}>Custo: <b style={{ color: "#f5cf6b" }}>{(buyAmt * 1000).toLocaleString()} ouro</b></div>
              <button disabled={bank.gold < buyAmt * 1000} onClick={() => onExchange("g2c", buyAmt)}
                style={{ width: "100%", background: bank.gold < buyAmt * 1000 ? "#333" : "linear-gradient(180deg,#4a9eff,#1e3a5f)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 800, cursor: "pointer" }}>
                Converter
              </button>
            </div>
            <div style={{ background: "#1a0f26", border: "1px solid #f5cf6b55", borderRadius: 10, padding: 14 }}>
              <div style={{ color: "#f5cf6b", fontWeight: 800, marginBottom: 6 }}>Vender 💎</div>
              <input type="number" min={1} value={sellAmt} onChange={(e) => setSellAmt(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: "100%", background: "#0e0818", color: "#f3e5c5", border: "1px solid #f5cf6b55", borderRadius: 6, padding: 8 }} />
              <div style={{ fontSize: 12, color: "#c8b8d0", margin: "8px 0" }}>Recebe: <b style={{ color: "#f5cf6b" }}>{(sellAmt * 800).toLocaleString()} ouro</b></div>
              <button disabled={bank.crystals < sellAmt} onClick={() => onExchange("c2g", sellAmt)}
                style={{ width: "100%", background: bank.crystals < sellAmt ? "#333" : "linear-gradient(180deg,#f5cf6b,#8b6a30)", color: "#0e0818", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 800, cursor: "pointer" }}>
                Converter
              </button>
            </div>
          </div>
        )}

        {activeView === "itens" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10, padding: 12, maxHeight: 400, overflowY: "auto" }}>
            {Object.entries(items).filter(([_, qty]) => qty > 0).map(([id, qty]) => (
              <div key={id} style={{ background: "#1a0f26", border: "1px solid #f5cf6b33", borderRadius: 8, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 24 }}>📦</div>
                <div style={{ fontSize: 10, color: "#f5cf6b", fontWeight: 800, marginTop: 4 }}>{ITEM_NAMES[id] || id.toUpperCase()}</div>
                <div style={{ fontSize: 12, color: "#fff", fontWeight: 900 }}>×{qty.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

        {activeView === "pokemon" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10, padding: 12, maxHeight: 400, overflowY: "auto" }}>
            {collection.map((entry) => (
              <div 
                key={entry.uid} 
                onClick={() => onOpenColecaoDetail(entry.uid)}
                style={{ background: "#1a0f26", border: "1px solid #8fd0ff33", borderRadius: 8, padding: 8, textAlign: "center", cursor: "pointer" }}
              >
                {gifMap[entry.species] && <img src={assetUrlFromJson(gifMap[entry.species])} alt="" style={{ width: 48, height: 48, imageRendering: "pixelated" }} />}
                <div style={{ fontSize: 9, color: "#8fd0ff", fontWeight: 800 }}>{entry.species.replace(/_/g, " ").toUpperCase()}</div>
                <div style={{ fontSize: 10, color: "#fff" }}>Nv. {entry.level}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        background: "linear-gradient(160deg, #2a1a0a, #3d2b0f)",
        border: "1px solid #ff9d3d88", borderRadius: 12, padding: 16,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#ff9d3d", fontWeight: 900, fontSize: 14 }}>🏛️ COFRE DE RESGATE</div>
          <div style={{ color: "#c8a878", fontSize: 11 }}>Sincronize seus bens preciosos com o cofre do reino.</div>
        </div>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("rubym:toast", { detail: { title: "Banco Medieval", body: "Recursos sincronizados!", tone: "success" } }))}
          style={{ padding: "10px 20px", background: "linear-gradient(180deg, #ff9d3d, #c67100)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 900, cursor: "pointer" }}
        >RESGATAR TUDO</button>
      </div>
    </div>
  );
}


// ============ MERCADO P2P (jogador vs jogador) ============
type MarketListing = {
  id: string;
  seller_id: string;
  seller_name: string;
  item_id: string;
  qty: number;
  price: number;
  currency?: "gold" | "crystal" | "safira";
  created_at: string;
};
function MarketScreen({
  items, bank, identity, isVip, onList, onBuy, onCancel, onClaimPayout, onNpcSell, npcPrices,
}: {
  items: Record<string, number>;
  bank: { gold: number; crystals: number };
  identity: LocalIdentity | null;
  isVip: boolean;
  onList: (itemId: string, qty: number, price: number, currency?: "gold" | "crystal" | "safira") => Promise<boolean>;
  onBuy: (l: { id: string; seller_id: string; item_id: string; qty: number; price: number; currency?: "gold" | "crystal" | "safira" }) => Promise<boolean>;
  onCancel: (l: { id: string; item_id: string; qty: number; seller_id: string }) => Promise<boolean>;
  onClaimPayout: (l: { id: string; item_id: string; qty: number; price: number; currency?: "gold" | "crystal" | "safira" }) => Promise<boolean>;
  onNpcSell: (id: string, qty?: number) => void;
  npcPrices: Record<string, number>;
}) {
  const LABELS: Record<string, string> = {
    pokeball: "Pokébola", greatball: "Great Ball", ultraball: "Ultra Ball",
    chest_amulet: "Amuleto do Baú",
    potion: "Poção",
    stone_grass: "Stone Verdejante 🌿", stone_fire: "Stone Ígnea 🔥",
    stone_water: "Stone Aquática 💧", stone_electric: "Stone Elétrica ⚡",
    stone_dark: "Stone Sombria 🌑", stone_dragon: "Stone Dragão 🐉",
  };
  const ICONS: Record<string, string> = {
    pokeball: "⚪", greatball: "🔴", ultraball: "🟡",
    chest_amulet: "🎗", potion: "🧪",
    stone_grass: "🌿", stone_fire: "🔥", stone_water: "💧",
    stone_electric: "⚡", stone_dark: "🌑", stone_dragon: "🐉",
  };
  const CUR_LABEL: Record<string, string> = { gold: "ouro", crystal: "💎 cristais", safira: "💚 safiras" };
  const CUR_COLOR: Record<string, string> = { gold: "#ff9d3d", crystal: "#6bd4ff", safira: "#7dffbe" };
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [soldPayouts, setSoldPayouts] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"browse" | "create" | "npc">("browse");
  const [selItem, setSelItem] = useState<string>("pokeball");
  const [selQty, setSelQty] = useState<number>(1);
  const [selPrice, setSelPrice] = useState<number>(500);
  const [selCurrency, setSelCurrency] = useState<"gold" | "crystal" | "safira">("gold");

  const refresh = async () => {
    setLoading(true);
    const [openRes, soldRes] = await Promise.all([
      supabase
        .from("market_listings")
        .select("id, seller_id, seller_name, item_id, qty, price, currency, created_at, sold_at")
        .is("sold_at", null)
        .order("created_at", { ascending: false })
        .limit(100),
      identity?.id
        ? (supabase as any)
            .from("market_listings")
            .select("id, seller_id, seller_name, item_id, qty, price, currency, created_at, sold_at, payout_claimed")
            .eq("seller_id", identity.id)
            .eq("payout_claimed", false)
            .not("sold_at", "is", null)
            .order("sold_at", { ascending: false })
            .limit(50)
        : Promise.resolve({ data: [], error: null } as any),
    ]);
    setLoading(false);
    if (!openRes.error && openRes.data) setListings(openRes.data as unknown as MarketListing[]);
    if (!soldRes.error && soldRes.data) setSoldPayouts(soldRes.data as unknown as MarketListing[]);
  };
  useEffect(() => { void refresh(); /* eslint-disable-next-line */ }, []);

  const mine = listings.filter((l) => l.seller_id === (identity?.id ?? ""));
  const others = listings.filter((l) => l.seller_id !== (identity?.id ?? ""));


  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ background: "linear-gradient(180deg,#3d2b0f,#241503)", border: "2px solid #ff9d3d66", borderRadius: 12, padding: 16, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#ff9d3d", fontWeight: 900, fontSize: 18, letterSpacing: 2 }}>🏷 MERCADO ENTRE TREINADORES</div>
          <div style={{ color: "#c8a878", fontSize: 12, marginTop: 4, fontStyle: "italic" }}>
            Compre e venda itens de outros jogadores. Anunciar é exclusivo <b style={{ color: "#ffd94d" }}>VIP ✦</b>.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: "#0e0818", border: "1px solid #f5cf6b55", borderRadius: 8, padding: "6px 12px", color: "#f5cf6b", fontWeight: 800 }}>💰 {bank.gold.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {(["browse", "create", "npc"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 800,
            border: mode === m ? "1px solid #ff9d3d" : "1px solid #3a2a4a",
            background: mode === m ? "#3d2b0f" : "transparent",
            color: mode === m ? "#ff9d3d" : "#c8b8d0", cursor: "pointer",
          }}>
            {m === "browse" ? "Anúncios" : m === "create" ? "Anunciar (VIP)" : "Vender NPC"}
          </button>
        ))}
        <button onClick={() => void refresh()} disabled={loading} style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 800, border: "1px solid #3a2a4a", background: "transparent", color: "#c8b8d0", cursor: loading ? "wait" : "pointer" }}>
          {loading ? "…" : "↻ Atualizar"}
        </button>
      </div>

      {mode === "browse" && (
        <div>
          {soldPayouts.length > 0 && (
            <div>
              <div style={{ color: "#ffd94d", fontSize: 12, fontWeight: 800, margin: "6px 2px" }}>💰 VENDAS CONCLUÍDAS — COLETAR PAGAMENTO</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10, marginBottom: 16 }}>
                {soldPayouts.map((l) => {
                  const cur = l.currency ?? "gold";
                  return (
                    <div key={l.id} style={{ background: "linear-gradient(180deg,#2a1f08,#150e02)", border: "1px solid #ffd94d88", borderRadius: 10, padding: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {STONE_CHEST[l.item_id] ? (
                          <img src={assetUrlFromJson(STONE_CHEST[l.item_id])} alt="" width={44} height={44} />
                        ) : (
                          <div style={{ fontSize: 22 }}>{ICONS[l.item_id] ?? "📦"}</div>
                        )}
                        <div>
                          <div style={{ color: "#ffd94d", fontWeight: 800, fontSize: 13 }}>Vendido: {l.qty}x {LABELS[l.item_id] ?? l.item_id}</div>
                          <div style={{ color: "#c8a878", fontSize: 11 }}>Receber <b style={{ color: CUR_COLOR[cur] }}>{l.price.toLocaleString()} {CUR_LABEL[cur]}</b></div>
                        </div>
                      </div>
                      <button onClick={() => void onClaimPayout({ id: l.id, item_id: l.item_id, qty: l.qty, price: l.price, currency: l.currency }).then((ok) => { if (ok) { setSoldPayouts((prev) => prev.filter((x) => x.id !== l.id)); } })}
                        style={{ width: "100%", marginTop: 8, background: "linear-gradient(180deg,#ffd94d,#8b6a10)", color: "#0e0818", border: "none", borderRadius: 6, padding: "8px 0", fontWeight: 800, cursor: "pointer", fontSize: 12 }}>
                        Coletar {l.price.toLocaleString()} {CUR_LABEL[cur]}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {mine.length > 0 && (
            <div>

              <div style={{ color: "#8fd0ff", fontSize: 12, fontWeight: 800, margin: "6px 2px" }}>MEUS ANÚNCIOS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 16 }}>
                {mine.map((l) => (
                  <div key={l.id} style={{ background: "#101a2a", border: "1px solid #4a9eff55", borderRadius: 10, padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {STONE_CHEST[l.item_id] ? (
                        <div style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle, rgba(255,217,77,0.18), transparent 70%)", borderRadius: 8, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }}>
                          <img src={assetUrlFromJson(STONE_CHEST[l.item_id])} alt="" width={52} height={52} style={{ imageRendering: "auto" }} />
                        </div>
                      ) : (
                        <div style={{ fontSize: 22 }}>{ICONS[l.item_id] ?? "📦"}</div>
                      )}
                      <div>
                        <div style={{ color: "#f5cf6b", fontWeight: 800, fontSize: 13 }}>{l.qty}x {LABELS[l.item_id] ?? l.item_id}</div>
                        <div style={{ color: "#8a7a9c", fontSize: 11 }}>Seu anúncio</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#c8b8d0", margin: "8px 0" }}>Preço: <b style={{ color: CUR_COLOR[l.currency ?? "gold"] }}>{l.price.toLocaleString()} {CUR_LABEL[l.currency ?? "gold"]}</b></div>

                    <button onClick={() => void onCancel(l).then((ok) => { if (ok) void refresh(); })}
                      style={{ width: "100%", background: "#3a1010", color: "#fff", border: "1px solid #ff6b6b55", borderRadius: 6, padding: "6px 0", fontWeight: 800, cursor: "pointer", fontSize: 12 }}>
                      Cancelar anúncio
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ color: "#ff9d3d", fontSize: 12, fontWeight: 800, margin: "6px 2px" }}>À VENDA ({others.length})</div>
          {others.length === 0 ? (
            <div style={{ color: "#8a7a9c", fontStyle: "italic", padding: 20, textAlign: "center" }}>Nenhum anúncio ativo no momento.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {others.map((l) => {
                const cur = l.currency ?? "gold";
                const bal = cur === "gold" ? bank.gold : cur === "crystal" ? bank.crystals : (items.safira_verde ?? 0);
                const canBuy = bal >= l.price;
                return (
                  <div key={l.id} style={{ background: "#1a0f26", border: "1px solid #ff9d3d66", borderRadius: 10, padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {STONE_CHEST[l.item_id] ? (
                        <div style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle, rgba(255,157,61,0.22), transparent 70%)", borderRadius: 10, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.7))" }}>
                          <img src={assetUrlFromJson(STONE_CHEST[l.item_id])} alt="" width={58} height={58} style={{ imageRendering: "auto" }} />
                        </div>
                      ) : (
                        <div style={{ fontSize: 22 }}>{ICONS[l.item_id] ?? "📦"}</div>
                      )}
                      <div>
                        <div style={{ color: "#f5cf6b", fontWeight: 800, fontSize: 13 }}>{l.qty}x {LABELS[l.item_id] ?? l.item_id}</div>
                        <div style={{ color: "#8a7a9c", fontSize: 11 }}>por <b style={{ color: "#c8b8d0" }}>{l.seller_name}</b></div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#c8b8d0", margin: "8px 0" }}>Preço: <b style={{ color: CUR_COLOR[cur] }}>{l.price.toLocaleString()} {CUR_LABEL[cur]}</b></div>
                    <button disabled={!canBuy} onClick={() => void onBuy(l).then((ok) => {
                        if (ok) {
                          setListings((prev) => prev.filter((x) => x.id !== l.id));
                          void refresh();
                        }
                      })}
                      style={{ width: "100%", background: !canBuy ? "#333" : "linear-gradient(180deg,#ff9d3d,#8b4a10)", color: "#0e0818", border: "none", borderRadius: 6, padding: "8px 0", fontWeight: 800, cursor: !canBuy ? "not-allowed" : "pointer", fontSize: 12 }}>
                      {canBuy ? "Comprar" : `${CUR_LABEL[cur]} insuficiente(s)`}
                    </button>

                  </div>
                );
              })}

            </div>
          )}
        </div>
      )}

      {mode === "create" && (
        <div style={{ background: "#1a0f26", border: `1px solid ${isVip ? "#ffd94d" : "#3a2a4a"}`, borderRadius: 10, padding: 16, maxWidth: 480 }}>
          {!isVip && (
            <div style={{ background: "#3a1010", border: "1px solid #ff6b6b55", borderRadius: 8, padding: 10, marginBottom: 12, color: "#ff9d9d", fontSize: 12 }}>
              ✦ Anunciar no mercado é exclusivo VIP. Compre um <b>Livro VIP 30d/60d</b> na Loja para liberar.
            </div>
          )}
          <div style={{ color: "#ffd94d", fontWeight: 800, fontSize: 14, marginBottom: 10 }}>Novo anúncio</div>
          <label style={{ fontSize: 12, color: "#c8b8d0", display: "block", marginBottom: 4 }}>Item</label>
          <select value={selItem} onChange={(e) => { const v = e.target.value; setSelItem(v); if (isStoneId(v)) setSelQty(STONE_PACK_SIZE); }}
            style={{ width: "100%", background: "#0e0818", color: "#f3e5c5", border: "1px solid #ffd94d55", borderRadius: 6, padding: 8, marginBottom: 10 }}>
            {Object.keys(npcPrices).map((id) => (
              <option key={id} value={id}>{LABELS[id] ?? id} (tenho {items[id] ?? 0})</option>
            ))}
          </select>
          {isStoneId(selItem) && STONE_CHEST[selItem] && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(180deg,#2a1a3e,#160b24)", border: "1px solid #ffd94d66", borderRadius: 10, padding: 10, marginBottom: 10 }}>
              <img src={assetUrlFromJson(STONE_CHEST[selItem])} alt="" width={64} height={64} style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.7))" }} />
              <div>
                <div style={{ color: "#ffd94d", fontWeight: 900, fontSize: 13 }}>Baú de {LABELS[selItem]}</div>
                <div style={{ color: "#c8b8d0", fontSize: 11 }}>Pack mínimo <b style={{ color: "#7dffbe" }}>{STONE_PACK_SIZE}</b> stones — pode anunciar mais.</div>
              </div>
            </div>
          )}
          <label style={{ fontSize: 12, color: "#c8b8d0", display: "block", marginBottom: 4 }}>Quantidade {isStoneId(selItem) && <span style={{ color: "#8a7a9c" }}>(mín. {STONE_PACK_SIZE} para stones)</span>}</label>
          <input type="number" min={isStoneId(selItem) ? STONE_PACK_SIZE : 1} max={99999} value={selQty}
            onChange={(e) => {
              const raw = Math.max(1, parseInt(e.target.value) || 1);
              setSelQty(isStoneId(selItem) ? Math.max(STONE_PACK_SIZE, raw) : raw);
            }}
            style={{ width: "100%", background: "#0e0818", color: "#f3e5c5", border: "1px solid #ffd94d55", borderRadius: 6, padding: 8, marginBottom: 10 }} />

          <label style={{ fontSize: 12, color: "#c8b8d0", display: "block", marginBottom: 4 }}>Moeda</label>
          <select value={selCurrency} onChange={(e) => setSelCurrency(e.target.value as any)}
            style={{ width: "100%", background: "#0e0818", color: "#f3e5c5", border: "1px solid #ffd94d55", borderRadius: 6, padding: 8, marginBottom: 10 }}>
            <option value="gold">💰 Ouro</option>
            <option value="crystal">💎 Cristal</option>
            <option value="safira">💚 Safira Verde</option>
          </select>
          <label style={{ fontSize: 12, color: "#c8b8d0", display: "block", marginBottom: 4 }}>Preço total ({CUR_LABEL[selCurrency]})</label>
          <input type="number" min={1} value={selPrice} onChange={(e) => setSelPrice(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: "100%", background: "#0e0818", color: "#f3e5c5", border: "1px solid #ffd94d55", borderRadius: 6, padding: 8, marginBottom: 12 }} />
          {(() => {
            const stoneQty = isStoneId(selItem) ? Math.max(STONE_PACK_SIZE, selQty) : selQty;
            const belowMin = isStoneId(selItem) && stoneQty < STONE_PACK_SIZE;
            const noStock = (items[selItem] ?? 0) < stoneQty;
            const disabled = !isVip || belowMin || noStock;
            return (
              <button disabled={disabled}
                onClick={async () => { const ok = await onList(selItem, stoneQty, selPrice, selCurrency); if (ok) { setMode("browse"); void refresh(); } }}
                style={{ width: "100%", background: disabled ? "#333" : "linear-gradient(180deg,#ffd94d,#8b6a10)", color: "#0e0818", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 800, cursor: disabled ? "not-allowed" : "pointer" }}>
                {!isVip ? "🔒 VIP necessário" : belowMin ? `Mínimo ${STONE_PACK_SIZE} stones` : noStock ? `Precisa de ${stoneQty}× ${LABELS[selItem] ?? selItem}` : `Publicar anúncio (${stoneQty}x)`}
              </button>
            );
          })()}
      </>


        </div>
      )}

      {mode === "npc" && (
        <div>
          <div style={{ color: "#c8a878", fontSize: 12, marginBottom: 10, fontStyle: "italic" }}>Venda rápida ao NPC — preço fixo, sem esperar comprador.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {Object.keys(npcPrices).map((id) => {
              const have = items[id] ?? 0;
              const price = npcPrices[id];
              const disabled = have <= 0;
              return (
                <div key={id} style={{ background: "#1a0f26", border: `1px solid ${disabled ? "#3a2a4a" : "#ff9d3d66"}`, borderRadius: 10, padding: 12, opacity: disabled ? 0.55 : 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ fontSize: 22 }}>{ICONS[id] ?? "📦"}</div>
                    <div>
                      <div style={{ color: "#f5cf6b", fontWeight: 800, fontSize: 13 }}>{LABELS[id] ?? id}</div>
                      <div style={{ color: "#8a7a9c", fontSize: 11 }}>Estoque: <b style={{ color: "#c8b8d0" }}>{have}</b></div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#c8b8d0", marginBottom: 8 }}>NPC: <b style={{ color: "#ff9d3d" }}>{price} ouro / un.</b></div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button disabled={disabled} onClick={() => onNpcSell(id, 1)}
                      style={{ flex: 1, background: disabled ? "#333" : "linear-gradient(180deg,#ff9d3d,#8b4a10)", color: "#0e0818", border: "none", borderRadius: 6, padding: "6px 0", fontWeight: 800, cursor: disabled ? "not-allowed" : "pointer", fontSize: 12 }}>
                      Vender 1
                    </button>
                    <button disabled={disabled || have < 10} onClick={() => onNpcSell(id, 10)}
                      style={{ flex: 1, background: (disabled || have < 10) ? "#333" : "#8b4a10", color: "#fff", border: "none", borderRadius: 6, padding: "6px 0", fontWeight: 800, cursor: (disabled || have < 10) ? "not-allowed" : "pointer", fontSize: 12 }}>
                      Vender 10
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
      )}
    </div>
  );
}


function PokemonDetail({ pet, currentHp, src }: { pet: PetInstance; currentHp: number; src: string | undefined }) {

  const base = SPECIES_BASE[pet.species];
  const maxHp = calcIdleMaxHp(pet);
  const hpPct = Math.max(0, (currentHp / maxHp) * 100);
  const xpNeeded = 100 + pet.level * 20;
  const xp = pet.xp ?? 0;
  const xpPct = Math.min(100, (xp / xpNeeded) * 100);
  const now = Date.now();
  const infinite = (ENERGY_REGEN_MS[pet.rarity] ?? 0) === 0;
  const energy = petCurrentEnergy(pet, now);
  const msFull = petMsToFull(pet, now);
  const crit = Math.round(Math.min(60, 5 + pet.level * 0.3 + (((pet.ascensionStats as Record<string, number> | undefined)?.crit) ?? 0) * 0.5) * 10) / 10;

  const rarityColor: Record<string, string> = {
    common: "#a0b4c8", uncommon: "#7ef27a", rare: "#6bd4ff",
    epic: "#c084fc", legendary: "#f5cf6b", mythic: "#ff7ac0", mythic_shiny: "#fff28a",
  };
  const rColor = rarityColor[pet.rarity] ?? "#f5cf6b";

  return (
    <div style={{
      position: "relative",
      background: "linear-gradient(160deg, #1a0f2e 0%, #0b0716 100%)",
      border: `1px solid ${rColor}55`,
      borderRadius: 10,
      padding: 10,
      boxShadow: `0 6px 18px rgba(0,0,0,0.5), inset 0 0 30px ${rColor}12`,
      display: "grid",
      gridTemplateColumns: "150px 1fr",
      gap: 10,
      alignItems: "stretch",
    }}>
      {/* LEFT: PORTRAIT + LEVEL */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <div style={{
          position: "relative",
          background: `radial-gradient(circle at 50% 40%, ${rColor}22 0%, #1a0a2e 60%, #0b0510 100%)`,
          border: `1px solid ${rColor}66`,
          borderRadius: 8,
          padding: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: 120,
          boxShadow: `inset 0 0 18px ${rColor}22`,
        }}>
          {src && <img src={assetUrlFromJson(src)} alt="" style={{ width: 96, height: 96, imageRendering: "pixelated", filter: `drop-shadow(0 3px 6px ${rColor}66)` }} />}
          <div style={{
            position: "absolute", top: 4, left: 4,
            fontSize: 8, letterSpacing: 1.5, color: "#8a7a9c", fontWeight: 700,
          }}>Nº {String(Object.keys(SPECIES_BASE).indexOf(pet.species) + 1).padStart(3, "0")}</div>
          <div style={{
            position: "absolute", bottom: 4, right: 4,
            background: "linear-gradient(180deg,#f5cf6b,#b8862a)",
            color: "#1a0f26", padding: "2px 7px", borderRadius: 10,
            fontWeight: 900, fontSize: 10, letterSpacing: 1,
            boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}>LV {pet.level}</div>
        </div>
        <div style={{
          padding: "4px 6px", fontSize: 9, fontWeight: 900, letterSpacing: 1.2,
          color: "#0b0510", background: rColor, borderRadius: 4, textAlign: "center",
        }}>{base.rarity.toUpperCase()}</div>
      </div>

      {/* RIGHT: NAME + BARS + STATS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
        <div style={{
          fontSize: 18, fontWeight: 900, color: rColor,
          textShadow: `1px 1px 0 #000, 0 0 10px ${rColor}55`,
          letterSpacing: 1.5, lineHeight: 1,
        }}>{pet.species.replace(/_/g, " ").toUpperCase()}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <StatBar label="HP" value={Math.floor(currentHp)} max={maxHp} pct={hpPct} color="#5ec26a" />
          <StatBar label="EXP" value={xp} max={xpNeeded} pct={xpPct} color="#6bd4ff" />
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
              <span style={{ color: "#c8b8d0", fontWeight: 700, letterSpacing: 1 }}>⚡ ENERGIA</span>
              <span style={{ color: "#8fd0ff", fontWeight: 700 }}>{infinite ? "∞ MÍTICO" : `${energy}/100${msFull > 0 ? " · " + fmtMS(msFull) : ""}`}</span>
            </div>
            <div style={{ height: 8, background: "#0e1a2e", borderRadius: 3, border: "1px solid rgba(0,0,0,0.6)" }}>
              <div style={{
                width: `${infinite ? 100 : energy}%`, height: "100%", borderRadius: 3,
                background: energy > 30 ? "linear-gradient(90deg,#3b7fd6,#6cb6ff)" : "linear-gradient(90deg,#c74a1a,#ff9a5a)",
              }} />
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          <StatCell label="ATK" value={base.atk} />
          <StatCell label="DEF" value={base.def} />
          <StatCell label="SPA" value={base.spa} />
          <StatCell label="SPD" value={base.spd} />
          <StatCell label="VEL" value={base.spe} />
          <StatCell label="HP" value={maxHp} />
          <StatCell label="CRIT" value={crit} />
        </div>

        {pet.ascensionStats && Object.keys(pet.ascensionStats).length > 0 && (
          <div style={{
            background: "linear-gradient(180deg, rgba(20,40,25,0.7), rgba(11,20,14,0.7))",
            border: "1px solid rgba(126,242,122,0.35)",
            borderRadius: 6, padding: "5px 7px",
          }}>
            <div style={{ color: "#7ef27a", fontSize: 9, fontWeight: 900, letterSpacing: 1.5, marginBottom: 4 }}>✨ ASCENSÃO</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {(["hp","atk","def","spa","spd","spe","crit"] as const).map((k) => {
                const v = (pet.ascensionStats as Record<string, number>)[k];
                if (!v) return null;
                const lbl: Record<string,string> = { hp:"HP", atk:"ATK", def:"DEF", spa:"SPA", spd:"SPD", spe:"VEL", crit:"CRIT" };
                return <StatCell key={k} label={`+${lbl[k]}`} value={v} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function StatBar({ label, value, max, pct, color }: { label: string; value: number; max: number; pct: number; color: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
        <span style={{ color: "#c8b8d0", fontWeight: 700, letterSpacing: 1 }}>{label}</span>
        <span style={{ color: "#f5cf6b", fontWeight: 700 }}>{value}/{max}</span>
      </div>
      <div style={{ height: 8, background: "#2a0808", borderRadius: 3, border: "1px solid rgba(0,0,0,0.6)" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 3,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          boxShadow: `0 0 6px ${color}66`,
          transition: "width 300ms",
        }} />
      </div>
    </div>
  );
}
function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <div style={{
      background: "linear-gradient(180deg, #1a0f26, #0b0510)",
      border: "1px solid rgba(245,207,107,0.22)",
      borderRadius: 4, padding: "3px 4px", textAlign: "center",
    }}>
      <div style={{ fontSize: 8, color: "#8a7a9c", letterSpacing: 1, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 900, color: "#f3e5c5", textShadow: "1px 1px 0 #000" }}>{value}</div>
    </div>
  );
}


// ===== Descrições curtas por raridade (fallback) e por espécie =====
const SPECIES_LORE: Partial<Record<Species, string>> = {
  charmander: "Um lagarto de fogo curioso. A chama em sua cauda revela seu ânimo — cresce quando saudável e feliz.",
  charmeleon: "Mais feroz e territorial, seu fogo já queima florestas inteiras se não for controlado.",
  charizard: "Poderoso dragão de fogo. Sua chama derrete rochas e voa acima das nuvens com facilidade.",
  bulbasaur: "Carrega uma semente nas costas que absorve luz solar para crescer aos poucos.",
  ivysaur: "A semente floresceu em um botão pesado que anuncia sua próxima evolução.",
  venusaur: "Sua flor libera aromas relaxantes; é conhecido por sua paciência e imensa força.",
  squirtle: "Esconde-se em seu casco quando ameaçado e dispara jatos d'água precisos.",
  wartortle: "Sua cauda peluda é sinal de longevidade — símbolo de sabedoria e sorte.",
  blastoise: "Canhões d'água de alta pressão em seu casco podem furar aço grosso.",
  pikachu: "Mochila elétrica ambulante. Solta faíscas quando surpreso ou emocionado.",
  mewtwo: "Criado em laboratório com propósitos bélicos — sua mente é uma tempestade psíquica.",
  mew: "Considerado ancestral de todos os Pokémon. Aparece somente para corações puros.",
  lucario: "Sente e manipula a aura ao seu redor; capaz de prever movimentos antes que aconteçam.",
};
const RARITY_LORE: Partial<Record<Rarity, string>> = {
  common: "Um companheiro leal — comum, mas cheio de potencial nas mãos certas.",
  uncommon: "Um pouco acima da média. Boa base para longas jornadas.",
  rare: "Raro de se encontrar — atrai olhares por onde passa.",
  epic: "Épico em batalha, temido por treinadores iniciantes.",
  legendary: "Um lendário — poucos treinadores têm o privilégio de encontrá-lo.",
  mythic: "Ser mítico e atemporal. Sua presença altera o curso do combate.",
  mythic_shiny: "Mítico brilhante — uma variante quase impossível de existir.",
};
function SpeciesLore({ species, rarity }: { species: Species; rarity: Rarity }) {
  const lore = SPECIES_LORE[species] ?? RARITY_LORE[rarity] ?? "Um Pokémon único, com história ainda por contar.";
  return (
    <div style={{
      marginTop: 14,
      background: "linear-gradient(135deg, #2a1a3e 0%, #1a0f26 100%)",
      border: "1px solid rgba(245,207,107,0.35)",
      borderRadius: 10, padding: 14,
      boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 14 }}>📖</span>
        <span style={{ color: "#f5cf6b", fontWeight: 900, fontSize: 12, letterSpacing: 2 }}>SOBRE {species.replace(/_/g, " ").toUpperCase()}</span>
      </div>
      <div style={{ fontSize: 13, color: "#e8dbe5", lineHeight: 1.55, fontStyle: "italic" }}>&ldquo;{lore}&rdquo;</div>
    </div>
  );
}
function ActiveBonuses({ leaderRarity, team, buffs, idle }: {
  leaderRarity: Rarity;
  team: { rarity: Rarity }[];
  buffs: { atk: number; def: number; expMult: number; expMultUntil?: number; goldMult?: number; goldMultUntil?: number };
  idle: any;
}) {

  const now = Date.now();
  const expActive = !!(buffs.expMultUntil && now < buffs.expMultUntil);
  const goldActive = !!(buffs.goldMultUntil && now < buffs.goldMultUntil);
  const rarityDropBonus: Partial<Record<Rarity, number>> = {
    rare: 0.03, epic: 0.07, legendary: 0.10, mythic: 0.15, mythic_shiny: 0.20,
  };
  const rarityBonus = rarityDropBonus[leaderRarity] ?? 0;
  const teamSynergyMap: Partial<Record<Rarity, number>> = {
    rare: 0.02, epic: 0.05, legendary: 0.10, mythic: 0.15, mythic_shiny: 0.20,
  };
  const synergyRarity = team.length >= 2 && team.every((p) => p.rarity === leaderRarity) ? leaderRarity : null;
  const synergyBonus = synergyRarity ? ((teamSynergyMap[synergyRarity] ?? 0) * (1 + (idle.globalStats?.synergy ?? 0) * 0.1)) : 0;
  const rarityLabel: Record<Rarity, string> = {
    common: "Comum", uncommon: "Incomum", rare: "Raro", epic: "Épico",
    legendary: "Lendário", mythic: "Mítico", mythic_shiny: "Mítico ✦",
  } as Record<Rarity, string>;
  const totalXpPct = Math.round(((expActive ? buffs.expMult : 0) + rarityBonus + synergyBonus) * 100);
  const totalGoldPct = Math.round(((goldActive ? (buffs.goldMult ?? 0) : 0) + rarityBonus + synergyBonus) * 100);
  const fmt = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h > 24 ? `${Math.floor(h / 24)}d` : (h > 0 ? `${h}h ${m}m` : `${m}m`);
  };
  const Chip = ({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) => (
    <div style={{
      background: `linear-gradient(180deg, ${color}22, ${color}08)`,
      border: `1px solid ${color}66`, borderRadius: 8, padding: "8px 10px",
      minWidth: 110, flex: "1 1 120px",
    }}>
      <div style={{ fontSize: 10, color: "#c8b8d0", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color, textShadow: "1px 1px 0 #000" }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: "#8a7a9c", marginTop: 2 }}>{sub}</div>}
    </div>
  );
  // Preview de sinergia por tier
  const synergyRow = (["rare","epic","legendary","mythic"] as Rarity[]).map((r) => ({
    r, pct: Math.round((teamSynergyMap[r] ?? 0) * 100),
    active: synergyRarity === r,
  }));
  return (
    <div style={{
      marginTop: 14,
      background: "#1a0f26", border: "1px solid rgba(245,207,107,0.15)",
      borderRadius: 10, padding: 12,
    }}>
      <div style={{ color: "#f5cf6b", fontSize: 12, fontWeight: 900, letterSpacing: 2, marginBottom: 8 }}>✨ BÔNUS ATIVOS</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Chip label="EXP TOTAL" value={`+${totalXpPct + Math.round((idle.globalStats?.mastery ?? 0) * 2)}%`} color="#6bd4ff"
          sub={`${expActive ? `Livro +${Math.round(buffs.expMult * 100)}% (${fmt(buffs.expMultUntil! - now)})` : "Sem livro"} · Líder +${Math.round(rarityBonus * 100)}% · Maestria +${Math.round((idle.globalStats?.mastery ?? 0) * 2)}%`} />
        <Chip label="OURO TOTAL" value={`+${totalGoldPct + Math.round((idle.globalStats?.synergy ?? 0) * 1)}%`} color="#ffd94d"
          sub={`${goldActive ? `VIP +${Math.round((buffs.goldMult ?? 0) * 100)}% (${fmt(buffs.goldMultUntil! - now)})` : "Sem VIP"} · Líder +${Math.round(rarityBonus * 100)}% · Sinergia +${Math.round((idle.globalStats?.synergy ?? 0) * 1)}%`} />
        <Chip label="DROP ITENS" value={`+${Math.round((rarityBonus + synergyBonus + (idle.globalStats?.mastery ?? 0) * 0.05) * 100)}%`} color="#c084fc"
          sub={`Líder ${leaderRarity} +${Math.round(rarityBonus * 100)}% · Maestria +${Math.round((idle.globalStats?.mastery ?? 0) * 5)}%`} />
        <Chip label="ATK / DEF" value={`+${Math.round((buffs.atk + (idle.globalStats?.attack ?? 0) * 0.05) * 100)}% / -${Math.round((buffs.def + (idle.globalStats?.resistance ?? 0) * 0.03) * 100)}%`} color="#ff7a3d"
          sub={`Bônus Globais: ATK Lv.${idle.globalStats?.attack ?? 0} · RES Lv.${idle.globalStats?.resistance ?? 0}`} />
      </div>
      <div style={{
        marginTop: 10, padding: "8px 10px",
        background: synergyBonus > 0 ? "linear-gradient(180deg,#2a1a3a,#180d24)" : "#150a1e",
        border: `1px solid ${synergyBonus > 0 ? "#c084fc66" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 8,
      }}>
        <div style={{ fontSize: 10, letterSpacing: 1, color: "#c8b8d0", marginBottom: 6 }}>
          🤝 SINERGIA DE TIME {synergyRarity ? `— ativo: ${rarityLabel[synergyRarity]} +${Math.round(synergyBonus * 100)}%` : "— monte um time todo da mesma tier"}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {synergyRow.map(({ r, pct, active }) => (
            <div key={r} style={{
              padding: "4px 8px", borderRadius: 6,
              background: active ? "#c084fc22" : "#0f0818",
              border: `1px solid ${active ? "#c084fc" : "rgba(255,255,255,0.08)"}`,
              fontSize: 10, color: active ? "#e9d5ff" : "#8a7a9c", fontWeight: 700,
            }}>
              {rarityLabel[r]} · +{pct}%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ============ Governante NPC — cutscene de diálogo premium ============
function GovernanteDialog(props: {
  open: boolean;
  cards: number;
  plusCards?: number;
  rioluCards?: number;
  currentEggs: number;
  onClose: () => void;
  onExchange: (qty: number) => void;
  onExchangePlus?: (qty: number) => void;
  onExchangeRiolu?: (qty: number) => void;
}) {
  const { open, cards, plusCards = 0, rioluCards = 0, currentEggs, onClose, onExchange, onExchangePlus, onExchangeRiolu } = props;
  const [step, setStep] = useState(0);
  useEffect(() => { if (open) setStep(0); }, [open]);
  if (!open) return null;
  const maxByCap = Math.max(0, 6 - currentEggs);
  const canGive = Math.min(cards, maxByCap);
  const canGivePlus = plusCards;
  const canGiveRiolu = rioluCards;
  const lines = [
    "Ah... um treinador digno enfim cruza meu salão.",
    plusCards > 0
      ? `Percebo o brilho de ${plusCards} Carta${plusCards > 1 ? "s" : ""} Suprema${plusCards > 1 ? "s" : ""} Plus. Cada uma materializa um Black Mitic Plus direto na sua Coleção, com 6 traits garantidos.`
      : cards > 0
        ? `Vejo em suas mãos ${cards} Carta${cards > 1 ? "s" : ""} Lendária${cards > 1 ? "s" : ""}. Cada uma vale um Black Mitic Plus Egg.`
        : "Você não porta nenhuma Carta... volte quando obtiver ao menos uma.",
    (canGive > 0 || canGivePlus > 0)
      ? `Posso materializar ${canGivePlus > 0 ? `${canGivePlus} Pokémon PLUS ✦ na Coleção` : ""}${canGivePlus > 0 && canGive > 0 ? " ou " : ""}${canGive > 0 ? `${canGive} ovo${canGive > 1 ? "s" : ""} comum` : ""}.`
      : (cards > 0 || plusCards > 0)
        ? "Mas você já carrega o máximo de 6 ovos comuns. Choque os primeiros antes de retornar."
        : "Volte quando estiver pronto.",
  ];
  const isLast = step >= lines.length - 1;
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 20000,
        background: "radial-gradient(ellipse at center, rgba(30,10,60,0.85), rgba(0,0,0,0.95))",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: "0 0 40px 0", backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 94vw)",
          background: "linear-gradient(180deg, rgba(40,20,70,0.98), rgba(15,5,30,0.98))",
          border: "3px solid transparent",
          borderImage: "linear-gradient(135deg, #ffd44a, #a066ff, #ffd44a) 1",
          borderRadius: 14,
          boxShadow: "0 0 40px rgba(160,80,255,0.55), inset 0 0 20px rgba(255,212,74,0.15)",
          padding: 16, display: "flex", gap: 16, color: "#f5eaff",
          position: "relative", animation: "govFadeIn 0.35s ease-out",
        }}
      >
        <style>{`
          @keyframes govFadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
          @keyframes govGlow { 0%,100% { filter: drop-shadow(0 0 8px #ffd44a);} 50% { filter: drop-shadow(0 0 20px #a066ff);} }
        `}</style>
        {/* Retrato */}
        <div style={{
          flex: "0 0 160px", height: 200,
          background: "linear-gradient(180deg, #2a1550, #150828)",
          border: "2px solid #ffd44a", borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", animation: "govGlow 3s ease-in-out infinite",
        }}>
          <img
            src={assetUrlFromJson(npcGovernanteUrl)}
            alt="Governante"
            style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }}
          />
        </div>
        {/* Conteúdo */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
            fontSize: 20, fontWeight: 900, letterSpacing: 2,
            color: "#ffd44a", textShadow: "0 0 10px rgba(255,212,74,0.6)",
          }}>
            👑 GOVERNANTE
            <span style={{ marginLeft: 8, fontSize: 10, color: "#c58bff", letterSpacing: 3 }}>SENHOR DAS CARTAS</span>
          </div>
          <div style={{
            background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,212,74,0.35)",
            borderRadius: 8, padding: 14, minHeight: 90, fontSize: 14, lineHeight: 1.5,
            fontStyle: "italic", color: "#f5eaff",
          }}>
            "{lines[step]}"
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontSize: 11, color: "#c58bff" }}>
              Cartas: <b style={{ color: "#ffd44a" }}>{cards}</b> · Plus: <b style={{ color: "#ffd44a" }}>{plusCards}</b> · Riolu: <b style={{ color: "#7ec4ff" }}>{rioluCards}</b> · Ovos atuais: <b style={{ color: "#ffd44a" }}>{currentEggs}/6</b>
            </div>
            <div style={{ flex: 1 }} />
            {!isLast ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                style={{
                  padding: "8px 16px", background: "linear-gradient(180deg, #a066ff, #6b28c8)",
                  border: "1px solid #c58bff", borderRadius: 8, color: "#fff",
                  fontWeight: 700, cursor: "pointer", fontSize: 12, letterSpacing: 1,
                }}
              >CONTINUAR ▸</button>
            ) : (canGive > 0 || canGivePlus > 0 || canGiveRiolu > 0) ? (
              <div>
                <button
                  onClick={onClose}
                  style={{
                    padding: "8px 14px", background: "rgba(40,20,60,0.8)",
                    border: "1px solid #5a3a7a", borderRadius: 8, color: "#c58bff",
                    fontWeight: 600, cursor: "pointer", fontSize: 11,
                  }}
                >Agora não</button>
                {canGivePlus > 0 && onExchangePlus && (
                  <button
                    onClick={() => { onExchangePlus(canGivePlus); onClose(); }}
                    style={{
                      padding: "10px 18px",
                      background: "linear-gradient(180deg, #d066ff, #4a1080)",
                      border: "1px solid #ffe988", borderRadius: 8, color: "#fff",
                      fontWeight: 900, cursor: "pointer", fontSize: 12, letterSpacing: 1,
                      boxShadow: "0 0 18px rgba(208,102,255,0.85)",
                    }}
                  >✦ PLUS {canGivePlus} POKÉMON{canGivePlus > 1 ? "S" : ""} NA COLEÇÃO</button>
                )}
                {canGiveRiolu > 0 && onExchangeRiolu && (
                  <button
                    onClick={() => { onExchangeRiolu(canGiveRiolu); onClose(); }}
                    style={{
                      padding: "10px 18px",
                      background: "linear-gradient(180deg, #1a1a4a, #050515)",
                      border: "1px solid #7ec4ff", borderRadius: 8, color: "#e0f0ff",
                      fontWeight: 900, cursor: "pointer", fontSize: 12, letterSpacing: 1,
                      boxShadow: "0 0 20px rgba(126,196,255,0.9), inset 0 0 12px rgba(160,80,255,0.4)",
                    }}
                  >🐺✦ RIOLU BLACK MITIC BRILHANT PLUS ×{canGiveRiolu}</button>
                )}
                {canGive > 0 && (
                  <button
                    onClick={() => { onExchange(canGive); onClose(); }}
                    style={{
                      padding: "10px 18px",
                      background: "linear-gradient(180deg, #ffd44a, #b88010)",
                      border: "1px solid #ffe988", borderRadius: 8, color: "#2a1500",
                      fontWeight: 900, cursor: "pointer", fontSize: 12, letterSpacing: 1,
                      boxShadow: "0 0 14px rgba(255,212,74,0.7)",
                    }}
                  >✦ RECEBER {canGive} OVO{canGive > 1 ? "S" : ""}</button>
                )}
              </div>
            ) : (
              <button
                onClick={onClose}
                style={{
                  padding: "10px 18px", background: "linear-gradient(180deg, #a066ff, #6b28c8)",
                  border: "1px solid #c58bff", borderRadius: 8, color: "#fff",
                  fontWeight: 700, cursor: "pointer", fontSize: 12, letterSpacing: 1,
                }}
              >Despedir-se</button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}



