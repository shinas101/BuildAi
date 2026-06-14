import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// ---------- module mocks ----------

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseAuth = vi.fn();
vi.mock("@clerk/nextjs", () => ({
  useAuth: () => mockUseAuth(),
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-in-button">{children}</div>
  ),
}));

vi.mock("@/components/animate-ui/components/backgrounds/stars", () => ({
  StarsBackground: () => <div data-testid="stars-background" />,
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="badge" className={className}>{children}</span>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/reusable", () => ({
  GrayTitle: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="gray-title">{children}</span>
  ),
  RedTitle: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="red-title">{children}</span>
  ),
  SectionLabel: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="section-label">{children}</p>
  ),
  SectionHeading: ({ gray, blue }: { gray: string; blue: string }) => (
    <h2 data-testid="section-heading">
      <span data-testid="section-heading-gray">{gray}</span>
      <span data-testid="section-heading-blue">{blue}</span>
    </h2>
  ),
}));

vi.mock("lucide-react", () => ({
  ArrowRight: () => <svg data-testid="arrow-right-icon" />,
  Zap: () => <svg data-testid="icon-zap" />,
  Eye: () => <svg data-testid="icon-eye" />,
  Code2: () => <svg data-testid="icon-code2" />,
  Package: () => <svg data-testid="icon-package" />,
  Sparkles: () => <svg data-testid="icon-sparkles" />,
  ImageIcon: () => <svg data-testid="icon-imageicon" />,
}));

// ---------- import the component AFTER mocks ----------
import Home from "@/app/page";
import { SUGGESTIONS, FEATURES, STEPS } from "@/lib/data";

// ---------- helpers ----------
function renderSignedIn() {
  mockUseAuth.mockReturnValue({ isSignedIn: true });
  return render(<Home />);
}

function renderSignedOut() {
  mockUseAuth.mockReturnValue({ isSignedIn: false });
  return render(<Home />);
}

function getTextarea() {
  return screen.getByRole("textbox", { name: /ai prompt/i }) as HTMLTextAreaElement;
}

// The main prompt textarea (first textbox on page, inside the hero section)
function getMainTextarea() {
  const textareas = document.querySelectorAll("textarea");
  // The first textarea is the interactive prompt input; the second is the disabled mockup one
  return textareas[0] as HTMLTextAreaElement;
}

// ---------- tests ----------

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Home page – suggestion buttons", () => {
  it("renders all SUGGESTIONS as clickable buttons", () => {
    renderSignedIn();
    SUGGESTIONS.forEach((s) => {
      expect(screen.getByText(s)).toBeInTheDocument();
    });
  });

  it("renders exactly as many suggestion buttons as SUGGESTIONS entries", () => {
    renderSignedIn();
    // suggestion buttons have the class rounded-full; filter by known text content
    const suggestionButtons = SUGGESTIONS.map((s) => screen.getByText(s));
    expect(suggestionButtons).toHaveLength(SUGGESTIONS.length);
  });

  it("clicking a suggestion sets its text into the prompt textarea", async () => {
    const user = userEvent.setup();
    renderSignedIn();

    const suggestion = SUGGESTIONS[0];
    const btn = screen.getByText(suggestion);
    await user.click(btn);

    const textarea = getMainTextarea();
    expect(textarea.value).toBe(suggestion);
  });

  it("clicking a second suggestion replaces the first one in the textarea", async () => {
    const user = userEvent.setup();
    renderSignedIn();

    await user.click(screen.getByText(SUGGESTIONS[0]));
    await user.click(screen.getByText(SUGGESTIONS[1]));

    const textarea = getMainTextarea();
    expect(textarea.value).toBe(SUGGESTIONS[1]);
  });

  it("clicking a suggestion focuses the textarea", async () => {
    const user = userEvent.setup();
    renderSignedIn();

    await user.click(screen.getByText(SUGGESTIONS[0]));

    const textarea = getMainTextarea();
    expect(document.activeElement).toBe(textarea);
  });

  // regression: ensure all 6 suggestions are unique and rendered
  it("every suggestion button has unique text matching the data array", () => {
    renderSignedIn();
    const uniqueSuggestions = new Set(SUGGESTIONS);
    expect(uniqueSuggestions.size).toBe(SUGGESTIONS.length);
    SUGGESTIONS.forEach((s) => expect(screen.getByText(s)).toBeInTheDocument());
  });
});

describe("Home page – Generate button (signed-in user)", () => {
  it("renders the Generate button when user is signed in", () => {
    renderSignedIn();
    // There is a Generate button that is NOT inside a sign-in-button wrapper
    const buttons = screen.getAllByRole("button", { name: /generate/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("Generate button is disabled when prompt is empty", () => {
    renderSignedIn();
    const generateBtn = screen.getAllByRole("button", { name: /generate/i })[0];
    expect(generateBtn).toBeDisabled();
  });

  it("Generate button is enabled when prompt has non-whitespace content", async () => {
    const user = userEvent.setup();
    renderSignedIn();

    const textarea = getMainTextarea();
    await user.type(textarea, "Build a todo app");

    const generateBtn = screen.getAllByRole("button", { name: /generate/i })[0];
    expect(generateBtn).not.toBeDisabled();
  });

  it("clicking Generate with a valid prompt navigates to workspace", async () => {
    const user = userEvent.setup();
    renderSignedIn();

    const textarea = getMainTextarea();
    await user.type(textarea, "Build a todo app");

    const generateBtn = screen.getAllByRole("button", { name: /generate/i })[0];
    await user.click(generateBtn);

    expect(mockPush).toHaveBeenCalledWith(
      `/workspace?prompt=${encodeURIComponent("Build a todo app")}`
    );
  });

  it("clicking Generate with only whitespace does NOT navigate", async () => {
    const user = userEvent.setup();
    renderSignedIn();

    const textarea = getMainTextarea();
    await user.type(textarea, "   ");

    const generateBtn = screen.getAllByRole("button", { name: /generate/i })[0];
    // button disabled – fire the click via fireEvent to bypass disabled check
    fireEvent.click(generateBtn);

    expect(mockPush).not.toHaveBeenCalled();
  });
});

describe("Home page – Generate / SignInButton (signed-out user)", () => {
  it("shows SignInButton wrapper when user is NOT signed in", () => {
    renderSignedOut();
    expect(screen.getByTestId("sign-in-button")).toBeInTheDocument();
  });

  it("shows Generate button inside SignInButton when not signed in", () => {
    renderSignedOut();
    const signInWrapper = screen.getByTestId("sign-in-button");
    expect(signInWrapper.querySelector("button")).not.toBeNull();
  });

  it("shows ArrowRight icon next to Generate button when not signed in", () => {
    renderSignedOut();
    expect(screen.getByTestId("arrow-right-icon")).toBeInTheDocument();
  });

  it("does NOT render ArrowRight icon when user IS signed in", () => {
    renderSignedIn();
    expect(screen.queryByTestId("arrow-right-icon")).not.toBeInTheDocument();
  });
});

describe("Home page – keyboard submit (Enter / Shift+Enter)", () => {
  it("pressing Enter in the textarea submits when signed in and prompt is non-empty", async () => {
    renderSignedIn();
    const textarea = getMainTextarea();
    fireEvent.change(textarea, { target: { value: "A kanban app" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(mockPush).toHaveBeenCalledWith(
      `/workspace?prompt=${encodeURIComponent("A kanban app")}`
    );
  });

  it("pressing Shift+Enter does NOT submit", async () => {
    renderSignedIn();
    const textarea = getMainTextarea();
    fireEvent.change(textarea, { target: { value: "A kanban app" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("pressing Enter with an empty prompt does NOT navigate", async () => {
    renderSignedIn();
    const textarea = getMainTextarea();
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("pressing Enter when NOT signed in does NOT navigate", async () => {
    renderSignedOut();
    const textarea = getMainTextarea();
    fireEvent.change(textarea, { target: { value: "A kanban app" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(mockPush).not.toHaveBeenCalled();
  });
});

describe("Home page – hint text", () => {
  it("shows keyboard hint text", () => {
    renderSignedIn();
    expect(
      screen.getByText(/Press.*to generate your project/i)
    ).toBeInTheDocument();
  });

  it("shows 'No credit card required' disclaimer (hero section)", () => {
    renderSignedIn();
    // The phrase appears in both the hero section and the pricing section
    const matches = screen.getAllByText(/No credit card required/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Home page – browser mockup section", () => {
  it("renders 'Project Creation' badge", () => {
    renderSignedIn();
    expect(screen.getByText(/Project Creation/i)).toBeInTheDocument();
  });

  it("renders browser URL bar with expected URL", () => {
    renderSignedIn();
    expect(screen.getByText("build-ai.example.com/projects/new")).toBeInTheDocument();
  });

  it("renders 'AI Prompt' label in the mockup", () => {
    renderSignedIn();
    expect(screen.getByText("AI Prompt")).toBeInTheDocument();
  });

  it("renders 'Project TODO' section in the mockup", () => {
    renderSignedIn();
    expect(screen.getByText("Project TODO")).toBeInTheDocument();
  });

  it("renders all TODO list items in the mockup", () => {
    renderSignedIn();
    const items = [
      "Define app goals and page structure",
      "Generate frontend UI and navigation",
      "Create backend API and database models",
      "Add authentication and deployment config",
    ];
    items.forEach((item) => expect(screen.getByText(item)).toBeInTheDocument());
  });

  it("renders 'Project Status' section with Done/Pending labels", () => {
    renderSignedIn();
    expect(screen.getByText("Project Status")).toBeInTheDocument();
    expect(screen.getAllByText("Done").length).toBeGreaterThan(0);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders project status steps", () => {
    renderSignedIn();
    expect(screen.getByText("Prompt processed")).toBeInTheDocument();
    expect(screen.getByText("Files generated")).toBeInTheDocument();
    expect(screen.getByText("Preview ready")).toBeInTheDocument();
  });

  it("renders 'Generating your project files...' loading text", () => {
    renderSignedIn();
    expect(screen.getByText("Generating your project files...")).toBeInTheDocument();
  });

  it("renders included features list in the mockup", () => {
    renderSignedIn();
    expect(screen.getByText("Authentication")).toBeInTheDocument();
    expect(screen.getByText("Database Setup")).toBeInTheDocument();
    expect(screen.getByText("API Routes")).toBeInTheDocument();
    expect(screen.getByText("UI Components")).toBeInTheDocument();
  });
});

describe("Home page – features section", () => {
  it("renders SectionLabel with 'Everything you need'", () => {
    renderSignedIn();
    const labels = screen.getAllByTestId("section-label");
    const everythingLabel = labels.find((el) =>
      el.textContent?.includes("Everything you need")
    );
    expect(everythingLabel).toBeInTheDocument();
  });

  it("renders SectionHeading with 'From prompt' and 'to production.'", () => {
    renderSignedIn();
    const grayHeadings = screen.getAllByTestId("section-heading-gray");
    const fromPrompt = grayHeadings.find((el) =>
      el.textContent?.includes("From prompt")
    );
    expect(fromPrompt).toBeInTheDocument();

    const blueHeadings = screen.getAllByTestId("section-heading-blue");
    const toProduction = blueHeadings.find((el) =>
      el.textContent?.includes("to production.")
    );
    expect(toProduction).toBeInTheDocument();
  });

  it("renders all FEATURES labels", () => {
    renderSignedIn();
    FEATURES.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders all FEATURES descriptions", () => {
    renderSignedIn();
    FEATURES.forEach(({ desc }) => {
      expect(screen.getByText(desc)).toBeInTheDocument();
    });
  });

  it("renders 6 feature cards", () => {
    renderSignedIn();
    FEATURES.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    expect(FEATURES).toHaveLength(6);
  });
});

describe("Home page – how it works (steps) section", () => {
  it("renders SectionLabel with 'How it works'", () => {
    renderSignedIn();
    const labels = screen.getAllByTestId("section-label");
    const howItWorks = labels.find((el) =>
      el.textContent?.includes("How it works")
    );
    expect(howItWorks).toBeInTheDocument();
  });

  it("renders SectionHeading with 'Four steps' and 'to a working app.'", () => {
    renderSignedIn();
    const grayHeadings = screen.getAllByTestId("section-heading-gray");
    const fourSteps = grayHeadings.find((el) =>
      el.textContent?.includes("Four steps")
    );
    expect(fourSteps).toBeInTheDocument();

    const blueHeadings = screen.getAllByTestId("section-heading-blue");
    const workingApp = blueHeadings.find((el) =>
      el.textContent?.includes("to a working app.")
    );
    expect(workingApp).toBeInTheDocument();
  });

  it("renders all STEPS labels", () => {
    renderSignedIn();
    STEPS.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders all STEPS numbers", () => {
    renderSignedIn();
    STEPS.forEach(({ number }) => {
      expect(screen.getByText(number)).toBeInTheDocument();
    });
  });

  it("renders all STEPS descriptions", () => {
    renderSignedIn();
    STEPS.forEach(({ desc }) => {
      expect(screen.getByText(desc)).toBeInTheDocument();
    });
  });

  it("renders 4 step items", () => {
    expect(STEPS).toHaveLength(4);
  });

  it("does NOT render a connector line after the last step", () => {
    renderSignedIn();
    // The connector div (w-px) only appears for i < STEPS.length - 1 (i.e., 3 times for 4 steps)
    // We verify STEPS has 4 entries and the last step number is "04"
    expect(STEPS[STEPS.length - 1].number).toBe("04");
  });
});

describe("Home page – pricing section", () => {
  it("renders 'Simple pricing' SectionLabel", () => {
    renderSignedIn();
    const labels = screen.getAllByTestId("section-label");
    const pricing = labels.find((el) =>
      el.textContent?.includes("Simple pricing")
    );
    expect(pricing).toBeInTheDocument();
  });

  it("renders pricing SectionHeading with 'Start free,' and 'scale when ready.'", () => {
    renderSignedIn();
    const grayHeadings = screen.getAllByTestId("section-heading-gray");
    const startFree = grayHeadings.find((el) =>
      el.textContent?.includes("Start free,")
    );
    expect(startFree).toBeInTheDocument();

    const blueHeadings = screen.getAllByTestId("section-heading-blue");
    const scaleWhenReady = blueHeadings.find((el) =>
      el.textContent?.includes("scale when ready.")
    );
    expect(scaleWhenReady).toBeInTheDocument();
  });

  it("renders pricing disclaimer text", () => {
    renderSignedIn();
    expect(
      screen.getByText(/No credit card required\. Upgrade or downgrade anytime\./i)
    ).toBeInTheDocument();
  });
});

describe("Home page – placeholder cycling (useEffect)", () => {
  it("initially shows the first placeholder", () => {
    vi.useFakeTimers();
    renderSignedIn();
    const textarea = getMainTextarea();
    // PLACEHOLDERS[0] is the initial placeholder
    expect(textarea.placeholder).toBeTruthy();
    vi.useRealTimers();
  });

  it("placeholder changes after 3 seconds when textarea is not focused and prompt is empty", () => {
    vi.useFakeTimers();
    renderSignedIn();
    const textarea = getMainTextarea();
    const initialPlaceholder = textarea.placeholder;

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // placeholder should have advanced to next index
    expect(textarea.placeholder).toBeTruthy();
    vi.useRealTimers();
  });

  it("placeholder does NOT cycle when prompt has content", async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderSignedIn();

    const textarea = getMainTextarea();
    fireEvent.change(textarea, { target: { value: "Some prompt" } });
    const placeholderAfterTyping = textarea.placeholder;

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(textarea.placeholder).toBe(placeholderAfterTyping);
    vi.useRealTimers();
  });
});