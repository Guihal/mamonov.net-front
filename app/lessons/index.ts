import type { LessonConfig } from '~/types/lesson'
import type { MascotPhraseInput } from '~/types/mascot'

import { fakeUpdateConfig, onLessonMounted as fakeUpdateMounted } from './home-fake-update/config'
import weakPasswordConfig, {
  onLessonMounted as weakPasswordMounted
} from './home-weak-password/config'
import wifiSecurityConfig, {
  onLessonMounted as wifiSecurityMounted
} from './home-wifi-security/config'
import {
  captivePortalConfig,
  onLessonMounted as captivePortalMounted
} from './wifi-captive-portal/config'
import phishingMessageConfig, {
  onLessonMounted as phishingMessageMounted
} from './office-phishing-message/config'
import phishingEmailConfig, {
  onLessonMounted as phishingEmailMounted
} from './office-phishing-email/config'
import {
  socialEngineeringConfig,
  onLessonMounted as socialEngineeringMounted
} from './office-social-engineering/config'
import { evilTwinConfig, onLessonMounted as evilTwinMounted } from './wifi-evil-twin/config'
import {
  trafficSniffConfig,
  onLessonMounted as trafficSniffMounted
} from './wifi-traffic-sniff/config'

export const LESSON_CONFIGS: Record<string, LessonConfig> = {
  'office-phishing-email': phishingEmailConfig,
  'home-fake-update': fakeUpdateConfig,
  'home-weak-password': weakPasswordConfig,
  'home-wifi-security': wifiSecurityConfig,
  'wifi-captive-portal': captivePortalConfig,
  'office-phishing-message': phishingMessageConfig,
  'office-social-engineering': socialEngineeringConfig,
  'wifi-evil-twin': evilTwinConfig,
  'wifi-traffic-sniff': trafficSniffConfig
}

/** Колбэк onMounted конкретного урока (стартовые реплики маскота, сброс стейта). */
export const LESSON_ON_MOUNTED: Record<
  string,
  (mascot: { enqueue: (items: MascotPhraseInput | MascotPhraseInput[]) => void }) => void
> = {
  'office-phishing-email': phishingEmailMounted,
  'home-fake-update': fakeUpdateMounted,
  'home-weak-password': weakPasswordMounted,
  'home-wifi-security': wifiSecurityMounted,
  'office-phishing-message': phishingMessageMounted,
  'office-social-engineering': socialEngineeringMounted,
  'wifi-captive-portal': captivePortalMounted,
  'wifi-evil-twin': evilTwinMounted,
  'wifi-traffic-sniff': trafficSniffMounted
}
