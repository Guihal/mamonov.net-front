import type { Component } from 'vue'
import type { ProgramType } from '~~/shared/types/Program'
import { defineAsyncComponent } from 'vue'

export type ProgramView = {
  label: string
  icon: string
  component?: Component
}

export const PROGRAMS: Record<ProgramType, ProgramView> = {
  explorer: {
    label: 'Проводник',
    icon: `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12h20l6 8h28v38H8V12zm4 4v38h46V24H32l-6-8H12z" fill="var(--icon-color)"/></svg>`,
    component: defineAsyncComponent(() => import('~/components/OS/Programs/Explorer/index.vue'))
  },
  browser: {
    label: 'Браузер',
    icon: `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 2C17.327 2 3 16.327 3 34s14.327 32 32 32 32-14.327 32-32S52.673 2 35 2zm0 4c4.18 0 8.14 1.04 11.6 2.88-1.56 1.8-3.28 3.32-4.6 3.52-2 .3-2 2.3-4 2.3s-3-1.3-5-1.3c-1.5 0-2.5.7-3 2-.5 1.3 0 2.6 1 3.6 1 1 2.2 1.4 2.2 2.4 0 .8-.6 1.8-2.2 1.8-2 0-3.2-1.6-5.2-1.6-1.4 0-2.4.8-2.8 2-.4 1.2.2 2.6 1.2 3.6 0 0 2 2 4 2 2.5 0 3.5-2 5.5-2 1.5 0 2.5.8 3.5.8 1.5 0 2.5-1.2 2.5-2.8 0-1.8-1.5-3-1.5-4.5 0-1 .5-2 2-2 2 0 3 1.5 5.5 1.5 1.8 0 3-.8 3.8-2.2C52.4 14.5 44.3 6 35 6zm16.6 6.5c.4.4.9 1 1.4 1.6.6.8 1 1.6 1 2.4 0 1.6-1.4 2.5-2.4 2.5-1.4 0-2.2-.8-3.4-.8-.8 0-1.2.4-1.2 1 0 .8.6 1.4 1 1.8.4.4.6.8.6 1.2 0 1-1 1.8-2 1.8-1.2 0-2-.6-3-.6-.6 0-1 .4-1 1s.6 1 1.2 1.4c.6.4 1.2.8 1.2 1.6 0 1.2-1.2 2.2-2.4 2.2-.8 0-1.6-.4-2.4-.4-.6 0-1 .4-1 1s.4 1 1 1.4c2 1 3 2 3 3.4 0 2-2 3.6-4 3.6-1.2 0-2-.4-3-.4C29 36 29 38 27 38c-2 0-3-2-5-2-1 0-2 .4-2.6 1.2C17.5 32.8 16 28.6 16 24c0-7 3.8-13.1 9.5-16.6 1 .2 2 .4 3 .4 1 0 2-.2 3-.6.2 0 .4 0 .6.2.8.4 1.6.8 2.4.8C36.2 8.2 37 7 38 7c1 0 2 .6 3 1.2 1 .6 2 1.2 3 1.2.6 0 1-.2 1.4-.4l.8-.4c.4-.4.8-.6 1.4-.6 1.4 0 3 1.2 4 2.5h.6c1.2 0 2.4-.4 3.4-1.4l.4.4zM35 62c-4.6 0-9-1.2-12.8-3.4 1.4-1.6 2.8-2.6 4.8-2.6 2.5 0 3.5 2 6 2 1.8 0 3-.8 3.8-2 .8-1.2 1.2-2.8 1.2-4.4 0-2.4-1-4.4-2.4-5.8-1.4-1.4-3.2-2.2-5.2-2.2-1.4 0-2.8.4-4 1.2-1.2.8-2 2-2.2 3.2-.2 1.2.2 2.4 1 3.2.4.4.6.8.6 1.2 0 .6-.6 1.2-1.6 1.2-1.2 0-2-.8-3.2-.8-.8 0-1.4.4-2 1-2.6-3.4-4-7.6-4-12.2 0-.6 0-1.2.1-1.8.3.2.6.2 1 .2 1 0 2-.4 2.8-1.2.8-.8 1.2-1.8 1.2-3 0-1.8-1.2-3-2.5-3.8-.5-.4-1-.6-1.5-.6-.2 0-.4 0-.6.1C14.2 30 14 29.2 14 28.4c0-1.4.4-2.8 1-4 .2.4.6.8 1 1 .6.4 1.4.6 2.2.6 2.5 0 4-2 4-4 0-1.6-1-3-2.4-3.8 3-4.8 7.6-8.4 13-10.2.2 1 .8 1.8 1.6 2.4.8.6 1.8 1 2.8 1 1.6 0 3-1 3.6-2.6 1-.2 2-.4 3-.4v.2c-.4.6-.6 1.4-.6 2.2 0 1.2.4 2.4 1.2 3.2.8.8 1.8 1.2 2.8 1.2.6 0 1.2-.2 1.6-.4.4 1.4 1.4 2.4 2.6 3 .4.2.8.2 1.2.2 1.6 0 3.2-1 4.2-2.8.4.4.8.8 1 1.2.4.8.4 1.6.4 2.6 0 1.8-.6 3.4-1.8 4.6-1.2 1.2-2.8 1.8-4.6 1.8-.8 0-1.6-.2-2.4-.4-.8-.2-1.6-.4-2.4-.4-1.4 0-2.6.6-3.4 1.6-.8 1-1.2 2.4-1.2 3.6 0 2 1 3.8 2.6 5 1.6 1.2 3.6 1.8 5.6 1.8 1.4 0 2.8-.4 3.8-1.2 1-.8 1.6-2 1.6-3.2 0-.8-.2-1.6-.6-2.2-.4-.6-.4-1.2-.4-1.6 0-.8.6-1.4 1.6-1.4.8 0 1.6.6 2.4.6.6 0 1.2-.2 1.6-.8C55 40.4 56 43.4 56 46.6c0 4.6-1.8 8.8-4.8 12C48 60.4 41.8 62 35 62z" fill="var(--icon-color)"/></svg>`,
    component: defineAsyncComponent(() => import('~/components/OS/Programs/Browser/index.vue'))
  },
  mail: {
    label: 'Почта',
    icon: `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12H66V14H68V56H66V58H4V56H2V14H4V12ZM6 16V54H64V16H6ZM8 18H62L35 38L8 18ZM10 22V52H60V22L35 42L10 22Z" fill="var(--icon-color)"/></svg>`,
    component: defineAsyncComponent(() => import('~/components/OS/Programs/Mail/index.vue'))
  },
  messenger: {
    label: 'Мессенджер',
    icon: `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H66V8H68V46H66V48H42L35 58L28 48H4V46H2V8H4V6ZM6 10V44H30L35 52L40 44H64V10H6ZM14 20H56V24H14V20ZM14 30H46V34H14V30Z" fill="var(--icon-color)"/></svg>`,
    component: defineAsyncComponent(() => import('~/components/OS/Programs/Messenger/index.vue'))
  },
  vpn: {
    label: 'VPN',
    icon: `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 4C22.3 4 12 14.3 12 27v10H8v4h8v-4-10c0-10.5 8.5-19 19-19s19 8.5 19 19v14h4V27C58 14.3 47.7 4 35 4z" fill="var(--icon-color)"/><path d="M35 26c-7.2 0-13 5.8-13 13v8c0 7.2 5.8 13 13 13s13-5.8 13-13v-8c0-7.2-5.8-13-13-13zm5 17.5L33 48v-5H28v-4h5v-5l7 4.5v5z" fill="var(--icon-color)"/></svg>`,
    component: defineAsyncComponent(() => import('~/components/OS/Programs/Vpn/index.vue'))
  }
}
