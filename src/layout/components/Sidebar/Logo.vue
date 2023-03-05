<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-show="logo" :src="logo" class="sidebar-logo-small">
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-show="logo" :src="logo" class="sidebar-logo">
      </router-link>
    </transition>
  </div>
</template>

<script>
import logo from '@/assets/images/logo.png'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      logo
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 80px;
  line-height: 80px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      vertical-align: middle;
    }
    & .sidebar-logo-small{
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
