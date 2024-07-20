import Vue from 'vue';
import { createRenderer } from 'vue-server-renderer';
import fs from 'fs';
import path from 'path';

import Certificate from './src/components/Certificate.vue';

const renderer = createRenderer();

const students = ["John Doe", "Jane Smith", "Alice Johnson"];

students.forEach(student => {
  const app = Vue.createApp({
    render: () => Vue.h(Certificate, { studentName: student })
  });

  const htmlFilePath = path.join(__dirname, `${student.replace(/ /g, '_')}.html`);

  renderer.renderToString(app).then(html => {
    fs.writeFileSync(htmlFilePath, html);
  }).catch(err => {
    console.error(err);
  });
});
