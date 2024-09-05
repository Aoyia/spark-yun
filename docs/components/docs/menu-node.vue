<template>
  <div class="menu-item-block" v-for="link in treeData" :key="link._path">
    <div
      v-if="link.children"
      class="menu-folder"
      @click.stop="handleFolderClick(link)"
    >
      <div class="menu-folder-title" :class="computeClass(link)">
        <span class="menu-folder-title-icon">
          <SvgIcon name="home"></SvgIcon>
        </span>
        <SkEllipsis class="menu-folder-title-text" truncated>
          {{ link.title }}
        </SkEllipsis>
        <div class="menu-folder-title-is-collapsed">
          <SvgIcon
            v-if="link.isCollapsed"
            name="arrow-right"
            color="#ccc"
          ></SvgIcon>
          <SvgIcon v-else name="arrow-down" color="#ccc"></SvgIcon>
        </div>
      </div>
      <div v-show="!link.isCollapsed" class="menu-folder-content">
        <MenuNode
          v-show="link.children"
          :treeData="link.children"
          @item-click="handleMenuItemClick"
        ></MenuNode>
      </div>
    </div>
    <div
      v-if="!link.children"
      class="menu-item"
      :class="{
        'menu-item-active': link._path === router.currentRoute.value.path,
        ...computeClass(link),
      }"
      @click.stop="handleMenuItemClick(link)"
    >
      <div class="menu-item-icon">
        <SvgIcon name="home"></SvgIcon>
      </div>
      <SkEllipsis class="menu-item-text" truncated>
        {{ link.title }}
      </SkEllipsis>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { defineProps, defineEmits, PropType, watch } from "vue";
interface MenuItem {
  title: string;
  _path: string;
  _id?: string;
  _draft?: boolean;
  isCollapsed?: boolean;
  children?: MenuItem[];
  [key: string]: any;
}
const { treeData } = defineProps({
  treeData: {
    type: Array as PropType<MenuItem[]>,
    required: true,
  },
});
const emit = defineEmits(["item-click"]);

function handleFolderClick(link: MenuItem) {
  link.isCollapsed = !link.isCollapsed;
}

function handleMenuItemClick(link: MenuItem) {
  emit("item-click", link);
}

const router = useRouter();

watch(
  () => router.currentRoute.value.path,
  (path) => {
    const link = treeData.find((item) => item._path === path);
    if (link) {
      link.isCollapsed = false;
    }
  }
);

function computeClass(link: MenuItem) {
  const path = link._path;
  // 剪切出 /docs/后面的内容，使用匹配的方式
  const reg = /\/docs\/(.*)/;
  const match = path.match(reg);
  // 计算截切出来的内容的层级
  const level = match ? match[1].split("/").length - 1 : 0;
  // 根据层级计算缩进
  return {
    [`menu-item-level-${level}`]: true,
  };
}
</script>

<style lang="scss" scoped>
.menu-item-block {
  .menu-folder {
    .menu-folder-title {
      display: flex;
      align-items: center;
      padding: 0 12px 0 0;
      height: 32px;
      cursor: pointer;
      .menu-folder-title-icon {
        margin-right: 8px;
        display: none;
      }
      .menu-folder-title-text {
        font-size: 16px;
        font-weight: 500;
      }
      .menu-folder-title-is-collapsed {
        margin-left: auto;
        margin-right: 6px;
      }
    }
    .menu-folder-content {
      // padding-left: 20px;
    }
  }
  .menu-item {
    color: var(--sk-color-font-menu);
    border-left: #ccc 2px solid;
    padding: 0 12px;
    height: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.1s;
    &:hover {
      border-left: var(--sk-color-home-primary) 2px solid;
      color: var(--sk-color-home-primary);
      background: #fffaf8;
    }
    .menu-item-icon {
      margin-right: 8px;
      display: none;
    }
    .menu-item-text {
      font-size: 14px;
      font-weight: 400;
    }
  }
  .menu-item-active {
    border-left: var(--sk-color-home-primary) 2px solid;
    color: var(--sk-color-home-primary) !important;
  }
  .menu-item-level-1 {
    padding-left: 0px !important;
  }
  .menu-item-level-2 {
    padding-left: 20px !important;
  }
  .menu-item-level-3 {
    padding-left: 40px !important;
  }
  .menu-item-level-4 {
    padding-left: 60px !important;
  }
  .menu-item-level-5 {
    padding-left: 80px !important;
  }
}
</style>
