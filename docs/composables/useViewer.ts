import { Ref, onMounted, onBeforeUnmount } from "vue";
import Viewer from "viewerjs";

interface VueComponent {
  $el: HTMLElement;
}

export default function useViewer(
  containerRef: Ref<VueComponent | null>,
  options: Viewer.Options = {}
) {
  let viewerInstance: Viewer | null = null;

  onMounted(() => {
    if (containerRef.value) {
      viewerInstance = new Viewer(containerRef.value.$el, {
        toolbar: true,
        navbar: true,
        zoomable: true,
        movable: true,
        scalable: true,
        transition: true,
        ...options,
      });
    }
  });

  onBeforeUnmount(() => {
    if (viewerInstance) {
      viewerInstance.destroy();
    }
  });
}
