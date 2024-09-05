<template>
  <main class="docs">
    <nav class="left-side">
      <NScrollbar class="scroll-bar" height="100%" :size="4" ref="scrollbarRef">
        <ContentNavigation class="nav" v-slot="{ navigation }">
          <DocsMenuNode
            class="nav-tree"
            :treeData="processMenuData(navigation)"
            @item-click="handleMenuItemClick"
          ></DocsMenuNode>
        </ContentNavigation>
      </NScrollbar>
    </nav>
    <article class="doc-content">
      <div class="content">
        <ContentRenderer v-if="data" :value="data">
          <ContentRendererMarkdown
            ref="markdownBodyRef"
            class="markdown-body github-markdown-light"
            :value="data"
          />
          <template #empty>
            <p>No content found.</p>
          </template>
        </ContentRenderer>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import { NavItem } from "@nuxt/content";
import getContentDirTree from "~/util/getContentDirTree";
import { useCounterStore, useMenuStore } from "~/store/index";
import { NScrollbar } from "naive-ui";
import useViewer from "~/composables/useViewer.ts";

definePageMeta({
  title: "首页",
  layout: "home",
});
const { params } = useRoute();
const { locale } = useI18n();
const { data, pending, error, refresh } = await useAsyncData("docs", () =>
  queryContent(`/` + params.slug.join("/")).findOne()
);

const toc = ref<NavItem[]>([]);
const markdownBodyRef = ref<null>(null);

onMounted(() => {
  init();
});
useViewer(markdownBodyRef, {
  toolbar: false,
});

const router = useRouter();
watch(
  () => router.currentRoute.value.path,
  () => {
    const firstPath = router.currentRoute.value.path.split("/")[1];
    const threePath = router.currentRoute.value.path.split("/")[3];
    if (firstPath === locale.value && threePath !== firstPath) {
      const newPath = router.currentRoute.value.path.replace(
        `/${threePath}/`,
        `/${locale.value}/`
      );
      router.push(newPath);
    }
  }
);

function init() {
  const { height } = useCounterStore();
  if (scrollbarRef.value?.$el?.nextElementSibling) {
    const scrollElement = scrollbarRef.value.$el.nextElementSibling
      .firstChild as HTMLElement;
    if (scrollElement) {
      scrollElement.scrollTop = height;
    }
  }
  const htmlStr = markdownBodyRef.value?.$el.innerHTML || "";
  toc.value = getContentDirTree(htmlStr);
}

function updatePathDeep(navItems: Array<NavItem>, parentPath = "") {
  navItems.forEach((item) => {
    if (item.children) {
      updatePathDeep(item.children, parentPath);
    }
    if (!item._path.startsWith(parentPath)) {
      item._path = parentPath + item._path;
    }
  });
}

function processMenuData(data: Array<NavItem>) {
  const currentLang = locale.value;
  const targetData = data.find((item) => {
    return item._path.slice(1) === currentLang;
  });
  data = targetData.children.flat();
  updatePathDeep(data, "/" + locale.value + "/docs");
  const { menuList, setMenuList } = useMenuStore();
  const flag = isEqual(data, menuList);
  if (flag) {
    return menuList;
  }

  // 过滤掉和父亲节点名字一致的儿子节点
  function filterIndex(data: Array<NavItem>) {
    data = data.filter((item) => {
      const itemTitle = item.title;
      if (item.children) {
        item.children = item.children.filter((child) => {
          return child.title !== itemTitle;
        });
        item.children = filterIndex(item.children);
      }
      return item;
    });
    return data;
  }

  data = filterIndex(data);
  // 遍历数据，将数据加上层级和isCollapsed
  function addLevel(data: Array<NavItem>, level = 0) {
    data.forEach((item) => {
      item.level = level;
      item.isCollapsed = true;
      if (item.children) {
        addLevel(item.children, level + 1);
      }
    });
  }
  addLevel(data);
  //使用lodash 合并data和menuList
  _Merge(data, menuList);
  setMenuList(data);

  return menuList;
}

const scrollbarRef = ref<HTMLElement | null>(null);
const scrollBarScrollTop = ref(0);
const { setHeightState } = useCounterStore();

function handleMenuItemClick(link: NavItem) {
  scrollBarScrollTop.value =
    scrollbarRef.value?.$el.nextElementSibling.firstChild.scrollTop;
  setHeightState(scrollBarScrollTop.value);
  const router = useRouter();
  router.push(link._path);
}

const resetNodeActiveStatus = (node) => {
  node.isActive = false;
  if (node.children) {
    node.children.forEach((child) => {
      resetNodeActiveStatus(child);
    });
  }
};

function handleTocItemClick(node: DirNode) {
  toc.value.forEach((item) => {
    resetNodeActiveStatus(item);
  });
  node.isActive = node.isActive ? false : true;

  const markdownBody = markdownBodyRef.value.$el;
  const HList = markdownBody.querySelectorAll(`h${node.hLevel}`);
  const H = Array.from(HList).find((item) => item.innerText === node.title);
  scrollTo(H);
  const router = useRouter();
  router.push({
    path: router.currentRoute.value.path,
    query: {
      anchor: node.title,
    },
  });
}

function scrollTo(element, headerOffset = 80) {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  console.log(elementPosition, window.pageYOffset, offsetPosition);

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}
</script>

<style scoped lang="scss">
.docs {
  width: 1200px;
  padding-top: 80px;
  margin: auto;
  .left-side {
    margin-top: 80px;
    background: white;
    width: 250px;
    position: fixed;
    top: 0;
    bottom: 0;
    border-right: 1px solid #ebebeb;

    .scroll-bar {
      .el-scrollbar__wrap {
        height: 100%;
        overflow: hidden;

        .el-scrollbar__view {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
        }
      }
    }
  }

  .doc-content {
    margin-left: 350px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;

    .aside {
      flex: 0;
      flex-basis: 260px;

      .aside-wrapper {
        box-sizing: border-box;
        overflow-x: auto;
        width: 238px;
        position: sticky;
        top: 120px;

        .aside-content {
        }
      }
    }

    .content {
      flex: 1;

      .markdown-body {
        width: 810px;
        margin-top: 70px;
        height: calc(100% - 80px);
        overflow-x: hidden;
        position: fixed;
        top: 0;
        bottom: 0;
        -ms-overflow-style: none;
        overflow-y: scroll;
        scrollbar-width: thin;
      }
    }
  }
}
</style>
