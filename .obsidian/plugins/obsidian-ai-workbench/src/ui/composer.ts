import { WriteBackMode } from "../types";

export interface ComposerHandle {
  setBusy: (busy: boolean) => void;
  setMode: (mode: WriteBackMode) => void;
  getMode: () => WriteBackMode;
  clear: () => void;
  focus: () => void;
}

export function createComposer(
  container: HTMLElement,
  options: {
    initialMode: WriteBackMode;
    onSubmit: (value: string) => void;
    onModeChange: (mode: WriteBackMode) => void;
  },
): ComposerHandle {
  const wrapper = container.createDiv({ cls: "ocw-composer" });
  const textarea = wrapper.createEl("textarea", {
    attr: {
      placeholder: "Ask OpenClaw to work with the current note...",
    },
  });

  const actions = wrapper.createDiv({ cls: "ocw-composer-actions" });
  const modeWrap = actions.createDiv({ cls: "ocw-modes" });
  const submit = actions.createEl("button", { text: "Send" });

  let mode: WriteBackMode = options.initialMode;
  let busy = false;

  const setActiveMode = () => {
    modeWrap.querySelectorAll("button").forEach((button) => button.classList.remove("is-active"));
    const active = modeWrap.querySelector(`[data-mode="${mode}"]`);
    active?.classList.add("is-active");
  };

  const addModeButton = (value: WriteBackMode, label: string): void => {
    const button = modeWrap.createEl("button", {
      text: label,
      cls: "ocw-mode-button",
    });
    button.dataset.mode = value;
    button.addEventListener("click", () => {
      mode = value;
      options.onModeChange(value);
      setActiveMode();
    });
  };

  addModeButton("append", "Append");
  addModeButton("replace-selection", "Replace");
  addModeButton("new-page", "New Page");
  setActiveMode();

  const submitCurrent = (): void => {
    const value = textarea.value.trim();
    if (!value || busy) {
      return;
    }
    options.onSubmit(value);
  };

  submit.addEventListener("click", submitCurrent);
  textarea.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submitCurrent();
    }
  });

  return {
    setBusy(nextBusy: boolean) {
      busy = nextBusy;
      submit.disabled = busy;
      textarea.disabled = busy;
    },
    setMode(nextMode: WriteBackMode) {
      mode = nextMode;
      setActiveMode();
    },
    getMode() {
      return mode;
    },
    clear() {
      textarea.value = "";
    },
    focus() {
      textarea.focus();
    },
  };
}
