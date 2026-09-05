import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref, reactive } from "vue";
import { GnBackBar, GnNavigationBar, GnNavigationHeader, GnNavigationItem, GnTabNavigationBar, GnTabNavigationItem } from "../../components/navigation";
import { GnButton, GnIconButton } from "../../components/buttons";
import { GnCard } from "../../components/layout";
import { GnFormInputField, GnFormDropDownField, GnFormTextField, GnSearchFormField } from "../../components/forms";

// A "page" is pure composition — every icon here is just inline SVG passed
// into the same default/scoped slots each component already exposes on its
// own. See new-gn-page/SKILL.md: nothing below introduces a new component
// or a prop/slot that doesn't already exist; a page demo's job is to prove
// the existing pieces click together into a real screen, not to work
// around gaps in them.
const logoIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,3 19.8,7.5 19.8,16.5 12,21 4.2,16.5 4.2,7.5"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 12L12 3M12 12L19.8 16.5M12 12L4.2 16.5"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const dashboardIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const teamIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="17" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="2" />
    <path d="M15.5 14a5 5 0 0 1 5.5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const settingsIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const userIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const helpIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
  </svg>
`;

const bellIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 20a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const lockIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const backIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M12 19l-7-7 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const meta = {
  title: "Pages/SettingsDashboard",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A realistic workspace settings screen composing every component currently in @graphyne/web-components into one page: a dark GnNavigationBar side rail (GnNavigationHeader + GnNavigationItem entries + trailing GnIconButtons), a GnBackBar page header carrying a GnSearchFormField and a GnIconButton in its actions slot, a GnTabNavigationBar switching between three sections, and GnCard panels holding a GnFormInputField / GnFormDropDownField / GnFormTextField form with GnButton actions in the footer. Nothing here is a new component — it's the same composition pattern as GnNavigationBar.stories.ts's SideNav/TopBar demos, just assembled into a full screen instead of one nav shell."
      }
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: {
      GnBackBar,
      GnNavigationBar,
      GnNavigationHeader,
      GnNavigationItem,
      GnTabNavigationBar,
      GnTabNavigationItem,
      GnButton,
      GnIconButton,
      GnCard,
      GnFormInputField,
      GnFormDropDownField,
      GnFormTextField,
      GnSearchFormField
    },
    setup() {
      const activeTab = ref("profile");
      const searchQuery = ref("");
      const form = reactive({
        name: "Jordan Rivera",
        email: "jordan@graphyne.dev",
        timezone: "pst",
        bio: ""
      });
      const timezoneOptions = [
        { label: "Pacific Time (PST)", value: "pst" },
        { label: "Mountain Time (MST)", value: "mst" },
        { label: "Central Time (CST)", value: "cst" },
        { label: "Eastern Time (EST)", value: "est" }
      ];
      return {
        activeTab,
        searchQuery,
        form,
        timezoneOptions,
        logoIcon,
        dashboardIcon,
        teamIcon,
        settingsIcon,
        userIcon,
        helpIcon,
        bellIcon,
        lockIcon,
        backIcon
      };
    },
    template: `
      <div style="position: fixed; inset: 0; display: flex; background-color: #f9fafb;">
        <GnNavigationBar direction="col" backgroundColor="#111827">
          <template #header>
            <GnNavigationHeader title="Graphyne" titleSize="15px" direction="col" textColor="#f9fafb">
              <span v-html="logoIcon" />
            </GnNavigationHeader>
          </template>
          <template #items>
            <GnNavigationItem label="Dashboard" direction="col" textColor="#d1d5db"><span v-html="dashboardIcon" /></GnNavigationItem>
            <GnNavigationItem label="Team" direction="col" textColor="#d1d5db"><span v-html="teamIcon" /></GnNavigationItem>
            <GnNavigationItem label="Settings" direction="col" textColor="#f9fafb" color="#f97316"><span v-html="settingsIcon" /></GnNavigationItem>
          </template>
          <template #trailing>
            <GnIconButton label="Help" variant="ghost" size="sm"><span v-html="helpIcon" /></GnIconButton>
            <GnIconButton label="Account" variant="ghost" size="sm"><span v-html="userIcon" /></GnIconButton>
          </template>
        </GnNavigationBar>

        <main style="flex: 1; min-width: 0; display: flex; flex-direction: column; overflow-y: auto;">
          <GnBackBar title="Workspace Settings" subtitle="Manage your workspace preferences" backLabel="Back to dashboard">
            <span v-html="backIcon" />
            <template #actions>
              <GnSearchFormField v-model="searchQuery" placeholder="Search settings" />
              <GnIconButton label="Notifications" variant="ghost" size="sm"><span v-html="bellIcon" /></GnIconButton>
            </template>
          </GnBackBar>

          <div style="padding: 0 1.5rem; max-width: 640px; width: 100%;">
            <GnTabNavigationBar v-model="activeTab" v-slot="{ active, select }">
              <GnTabNavigationItem label="Profile" :selected="active === 'profile'" @gn-click="select('profile')"><span v-html="userIcon" /></GnTabNavigationItem>
              <GnTabNavigationItem label="Notifications" :selected="active === 'notifications'" @gn-click="select('notifications')"><span v-html="bellIcon" /></GnTabNavigationItem>
              <GnTabNavigationItem label="Security" :selected="active === 'security'" @gn-click="select('security')"><span v-html="lockIcon" /></GnTabNavigationItem>
            </GnTabNavigationBar>

            <div style="padding: 1.5rem 0;">
              <section v-show="activeTab === 'profile'">
                <GnCard title="Profile">
                  <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <GnFormInputField label="Full name" v-model="form.name" />
                    <GnFormInputField label="Email" type="email" v-model="form.email" />
                    <GnFormDropDownField label="Timezone" v-model="form.timezone" :options="timezoneOptions" />
                    <GnFormTextField label="Bio" v-model="form.bio" placeholder="Tell your team a bit about yourself" />
                  </div>
                  <template #footer>
                    <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                      <GnButton variant="ghost">Cancel</GnButton>
                      <GnButton variant="primary">Save changes</GnButton>
                    </div>
                  </template>
                </GnCard>
              </section>

              <section v-show="activeTab === 'notifications'">
                <GnCard title="Notification preferences">
                  <p>Email and push notification settings for this workspace would go here.</p>
                </GnCard>
              </section>

              <section v-show="activeTab === 'security'">
                <GnCard title="Security">
                  <p>Two-factor authentication and active session management would go here.</p>
                </GnCard>
              </section>
            </div>
          </div>
        </main>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The tab bar and section switching is entirely consumer-owned, exactly as GnTabNavigationBar's own doc comment describes: `activeTab` is a plain ref, GnTabNavigationBar only supplies `active`/`select` through its scoped slot, and this page decides what v-show'd content each tab identifier maps to."
      }
    }
  }
};
