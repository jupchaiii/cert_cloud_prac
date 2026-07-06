// docs.js — Document metadata
export const documents = [
  {
    id: 'study-guide',
    file: 'AWS-Cloud-Practitioner-Study-Guide.md',
    title: { th: 'คู่มือศึกษาและสรุป Services', en: 'Study Guide & Services Summary' },
    description: {
      th: 'สรุปครบทุก Domain ของข้อสอบ CLF-C02 พร้อมอธิบาย Services หลัก',
      en: 'Complete summary of every CLF-C02 exam Domain with core Services explained',
    },
    color: '#ff9900',
  },
  {
    id: 'cloud-practitioner',
    file: 'cloud-practitioner.md',
    title: { th: 'ภาพรวมการสอบ CLF-C02', en: 'CLF-C02 Exam Overview' },
    description: {
      th: 'โครงสร้างข้อสอบ ขอบเขตเนื้อหา และบริการที่อยู่ในขอบเขต',
      en: 'Exam structure, scope, and the AWS services in scope',
    },
    color: '#232f3e',
  },
  {
    id: 'ec2-detailed',
    file: 'aws-ec2-detailed.md',
    title: { th: 'Amazon EC2 — ฉบับสมบูรณ์', en: 'Amazon EC2 — Complete Guide' },
    description: {
      th: 'Instance types, purchasing options, AMI, storage และ networking',
      en: 'Instance types, purchasing options, AMI, storage, and networking',
    },
    color: '#ec7211',
  },
  {
    id: 'details-of-services',
    file: 'details-of-services.md',
    title: { th: 'รายละเอียดบริการ AWS', en: 'AWS Services in Detail' },
    description: {
      th: 'ความสามารถ ขอบเขต และการนำไปใช้งานของบริการ 95+ ตัว',
      en: 'Capabilities, scope, and use cases of 95+ AWS services',
    },
    color: '#146eb4',
  },
];

export function getDoc(id) {
  return documents.find((d) => d.id === id);
}
