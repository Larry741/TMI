import { useState, useRef, useCallback, useEffect } from "react";

interface Style {
  top?: number;
  bottom?: number;
  right: number;
}

const useDropdown = (
  parentScrollContainer = "content_container",
  dropdownHeight = 360
) => {
  const [style, setStyle] = useState<{
    top?: number;
    bottom?: number;
    right: number;
  }>();
  const [dropdownId, setDropdownId] = useState<number | string | null>();
  const scrollDebounceRef = useRef<NodeJS.Timeout>();
  const scrollEventCallback = useRef<() => void>();

  useEffect(() => {
    const closeDropDown = () => {
      const scrollContainer = document.getElementById(parentScrollContainer);
      if (scrollContainer) {
        scrollContainer.removeEventListener(
          "scroll",
          scrollEventCallback.current!
        );
      }
      setDropdownId(null);
    };
    document.documentElement.addEventListener("click", closeDropDown);

    return () => {
      document.documentElement.removeEventListener("click", closeDropDown);
      const scrollContainer = document.getElementById(parentScrollContainer);
      if (scrollContainer) {
        scrollContainer.removeEventListener(
          "scroll",
          scrollEventCallback.current!
        );
      }
    };
  }, [parentScrollContainer]);

  const closeScroll = () => {
    setDropdownId(null);
  };

  const showDropdown = useCallback(
    (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      const targetEl = e.currentTarget.closest("td")!;
      const scrollContainer = document.getElementById(`content_container`);
      if (scrollContainer) {
        scrollContainer.removeEventListener(
          "scroll",
          scrollEventCallback.current!
        );
      }

      scrollEventCallback.current = closeScroll;

      const elRectTop =
        document.body.scrollTop + targetEl.getBoundingClientRect().top;

      let elStyle: Style = {
        right:
          document.documentElement.clientWidth -
          targetEl.getBoundingClientRect().right
      };
      if (elRectTop > document.documentElement.clientHeight) {
        elStyle.top = elRectTop;
      } else {
        elStyle.top = elRectTop;
      }
      setStyle(elStyle);

      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", closeScroll);
      }

      if (dropdownId == id) {
        if (scrollContainer) {
          scrollContainer.removeEventListener("scroll", closeScroll);
        }
        setDropdownId(null);
        return;
      }
      setDropdownId(id);
    },
    [dropdownId]
  );

  return {
    style,
    dropdownId,
    setDropdownId,
    showDropdown
  };
};

export default useDropdown;
