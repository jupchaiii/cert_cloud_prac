// i18n.js — Thai/English UI strings
const dict = {
  th: {
    appTitle: 'AWS Cloud Practitioner',
    appSubtitle: 'คู่มือเตรียมสอบฉบับสมบูรณ์',
    nav: {
      home: 'หน้าหลัก',
      documents: 'เอกสาร',
      about: 'เกี่ยวกับ',
    },
    home: {
      welcome: 'ยินดีต้อนรับ',
      intro: 'แหล่งรวมความรู้สำหรับเตรียมสอบ AWS Certified Cloud Practitioner (CLF-C02) — เนื้อหาครบทุก Domain พร้อมสรุปบริการ AWS ที่อยู่ในขอบเขตการสอบ',
      startReading: 'เริ่มอ่าน',
      documentsTitle: 'เอกสารทั้งหมด',
      documentsSubtitle: 'เลือกเอกสารที่ต้องการอ่าน',
      statsTitle: 'ภาพรวม',
      statsFiles: 'เอกสาร',
      statsServices: 'บริการที่ครอบคลุม',
      statsDomains: 'Domains',
    },
    doc: {
      backToHome: 'กลับหน้าหลัก',
      contents: 'สารบัญ',
      readingTime: 'เวลาอ่านโดยประมาณ',
      minutes: 'นาที',
      onThisPage: 'ในหน้านี้',
      loading: 'กำลังโหลดเนื้อหา...',
      error: 'เกิดข้อผิดพลาดในการโหลดเอกสาร',
    },
    about: {
      title: 'เกี่ยวกับเว็บนี้',
      p1: 'เว็บนี้สร้างจากไฟล์ Markdown ในโปรเจ็ค cert_cloud_prac เพื่อให้อ่านง่าย ค้นหาสะดวก และสลับภาษา UI ได้',
      p2: 'เนื้อหาทั้งหมดมาจาก repository ต้นทาง — การแก้ไขเนื้อหาทำได้โดยแก้ไฟล์ .md แล้ว push กลับเข้า repo',
      techTitle: 'เทคโนโลยีที่ใช้',
      tech: ['Vite', 'React 19', 'React Router', 'react-markdown', 'remark-gfm'],
    },
    lang: {
      th: 'ไทย',
      en: 'English',
      switchTo: 'EN',
    },
    footer: {
      builtWith: '',
      source: 'GitHub',
    },
  },
  en: {
    appTitle: 'AWS Cloud Practitioner',
    appSubtitle: 'Complete study guide',
    nav: {
      home: 'Home',
      documents: 'Documents',
      about: 'About',
    },
    home: {
      welcome: 'Welcome',
      intro: 'A comprehensive study resource for the AWS Certified Cloud Practitioner (CLF-C02) exam — covering all Domains and the AWS services in scope.',
      startReading: 'Start reading',
      documentsTitle: 'All documents',
      documentsSubtitle: 'Pick a document to start reading',
      statsTitle: 'Overview',
      statsFiles: 'Documents',
      statsServices: 'Services covered',
      statsDomains: 'Domains',
    },
    doc: {
      backToHome: 'Back to home',
      contents: 'Contents',
      readingTime: 'Estimated reading time',
      minutes: 'min',
      loading: 'Loading content...',
      error: 'Failed to load document',
    },
    about: {
      title: 'About this site',
      p1: 'This site is built from Markdown files in the cert_cloud_prac project to make studying easier, searchable, and bilingual.',
      p2: 'All content comes from the source repository — to update the material, edit the .md files and push them back to the repo.',
      techTitle: 'Built with',
      tech: ['Vite', 'React 19', 'React Router', 'react-markdown', 'remark-gfm'],
    },
    lang: {
      th: 'ไทย',
      en: 'English',
      switchTo: 'TH',
    },
    footer: {
      builtWith: '',
      source: 'GitHub',
    },
  },
};

let current = 'th';
const listeners = new Set();

export function getLang() {
  return current;
}

export function setLang(lang) {
  if (lang !== 'th' && lang !== 'en') return;
  current = lang;
  try {
    localStorage.setItem('lang', lang);
  } catch {}
  listeners.forEach((fn) => fn(lang));
}

export function initLang() {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'th' || saved === 'en') current = saved;
  } catch {}
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function t(key) {
  const parts = key.split('.');
  let cur = dict[current];
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return key;
  }
  return cur;
}
