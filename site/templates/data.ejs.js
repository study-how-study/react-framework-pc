let components = []
let hooks = []
let pages = []
let others = []

let files = [
  <% components.forEach(function (item) { %>
  {
    index: require('<%= item.index %>'),
    demos: [
    <% item.demos.forEach(function (demo) { %>
    {
      key: '<%= demo.key %>',
      require: require('<%= demo.path %>')
    },
    <% }); %>
    ]
  },
  <% }); %>
]

for (const item of files) {
  components.push(item)
}

files = [
  <% hooks.forEach(function (item) { %>
  {
    index: require('<%= item.index %>'),
    demos: [
    <% item.demos.forEach(function (demo) { %>
    {
      key: '<%= demo.key %>',
      require: require('<%= demo.path %>')
    },
    <% }); %>
    ]
  },
  <% }); %>
]

for (const item of files) {
  hooks.push(item)
}

files = [
  <% pages.forEach(function (item) { %>
  {
    index: require('<%= item.index %>'),
    demos: [
    <% item.demos.forEach(function (demo) { %>
    {
      key: '<%= demo.key %>',
      require: require('<%= demo.path %>')
    },
    <% }); %>
    ]
  },
  <% }); %>
]

for (const item of files) {
  pages.push(item)
}

files = [
  <% others.forEach(function (item) { %>
  {
    index: require('<%= item.index %>'),
    demos: [
    <% item.demos.forEach(function (demo) { %>
    {
      key: '<%= demo.key %>',
      require: require('<%= demo.path %>')
    },
    <% }); %>
    ]
  },
  <% }); %>
]

for (const item of files) {
  others.push(item)
}

exports.docs = { components, hooks, pages, others }
