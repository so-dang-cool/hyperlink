const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);
const safe = (f, errmsg) => { try { return f(); } catch (error) { console.error({ message: errmsg, error }); } };
const load = () => safe(() => JSON.parse(localStorage.getItem('hyperlink')), 'Unable to load');
const save = hyperlink => localStorage.setItem('hyperlink', JSON.stringify(hyperlink));
const toDom = ([selector, f]) => [...qsa(selector)].map(f);
const newElem = (tag, f) => f(document.createElement(tag));
const idsafe = s => s.replace(/\W/g, '');
const activate = url => qs('main > iframe').src = url;
const removeLink = name => {
  delete hyperlink.links[name];
  const elem = qs(`#${idsafe(name)}`);
  elem.parentNode.removeChild(elem);
};
const addLink = (name, url) => newElem('li', li => {
  hyperlink.links[name] = url;

  newElem('a', a => {
    a.href = url;
    a.innerText = name;
    a.target = '_blank';

    li.appendChild(a);
  })

  li.id = idsafe(name);
  li.onclick = event => event.altKey ? removeLink(name) : null; // activate(url);
 
  qs('#left_sidebar > ul').appendChild(li);
});


const DEFAULT_STATE = {
    title: "𝕙𝕪𝕡𝕖𝕣𝕝𝕚𝕟𝕜",
    links: {
      hyperlink: 'https://github.com/so-dang-cool/hyperlink',
      'so.dang.cool': 'https://so.dang.cool',
    }
  };



/* ***** Init ***** */

const hyperlink = load() ?? DEFAULT_STATE;
console.debug({ message: 'Loading', hyperlink });

toDom(['title, #title', it => it.innerText = hyperlink.title]);

qs('#left_sidebar').innerHTML = '<ul></ul>';

Object.entries(hyperlink.links).sort().map(([name, url]) => addLink(name, url));



/* ***** Manage ***** */

setInterval(() => save(hyperlink), 30 * 1000);


qs('#new_link').addEventListener('keydown', event => {
  if (event.key != 'Enter') { return; }

  addLink(qs('#new_name').value, qs('#new_link').value);
  
  qs('#new_name').value = '';
  qs('#new_link').value = '';
});

