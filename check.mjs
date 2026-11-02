import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync('portfolio-data.js', 'utf8'), context);
const { categories, projects } = context.window.PORTFOLIO;
assert.equal(new Set(projects.map(p => p.id)).size, projects.length, '项目 ID 必须唯一');
let images = 0;
for (const project of projects) {
  assert(categories.some(c => c.id === project.category), '项目分类必须存在');
  assert(project.images[project.cover], '项目封面必须存在');
  for (const image of project.images) {
    assert(fs.existsSync(image.src), '缺失图片：' + image.src);
    assert(fs.existsSync(image.thumb), '缺失缩略图：' + image.thumb);
    images++;
  }
}
const css = fs.readFileSync('style.css', 'utf8');
assert(!/KaiTi|STKaiti|Baskerville|Segoe Print|Courier/.test(css), '页面应使用现代无衬线字体');
console.log(`检查通过：${categories.length} 个分类，${projects.length} 个项目，${images} 张完整图片及缩略图。`);
