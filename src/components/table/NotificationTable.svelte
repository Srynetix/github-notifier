<script lang="ts">
  import {
    DataTable,
    Pagination,
    Modal,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    Button,
  } from "carbon-components-svelte";
  import {
    CheckmarkFilled,
    Erase,
    WatsonHealthRotate_360,
    HelpFilled,
  } from "carbon-icons-svelte";
  import {
    appNotificationIsClosed,
    type AppNotification,
  } from "@/domain/AppNotification";
  import Cell from "./Cell.svelte";
  import type { DataTableRow } from "carbon-components-svelte/src/DataTable/DataTable.svelte";
  import {
    filterQueryFunction,
    mergeQuery,
    parseFilterQuery,
    queryToString,
  } from "@/domain/filter";
  import { markNotificationThreadAsRead } from "@/api/notification";
  import { createEventDispatcher } from "svelte";
  import {
    storeNotificationsInCache,
    updateNotificationInCache,
  } from "@/store/notification";
  import LoadingButton from "@/components/items/LoadingButton.svelte";
  import UserNotificationStatus from "@/components/UserNotificationStatus.svelte";
  import HelpModal from "@/components/modals/HelpModal.svelte";

  export let notifications: AppNotification[];
  export let refreshing: boolean = false;
  export let newNotificationIds: string[];

  let currentSearch = "";
  let filteredRowIds: ReadonlyArray<number> = [];
  let showMarkClosedModal = false;
  let showCleanReadItemsModal = false;
  let showHelpModal = false;
  let markingClosedItemsAsRead = false;

  let pageSize = 8;
  let page = 1;

  $: closedItemCount = notifications.filter(
    (n) => n.unread && appNotificationIsClosed(n),
  ).length;
  $: readItemCount = notifications.filter((n) => !n.unread).length;

  const dispatch = createEventDispatcher();

  function rowAsNotification(row: DataTableRow): AppNotification {
    return row as AppNotification;
  }

  function rowFilterFunction(
    row: DataTableRow,
    value: string | number,
  ): boolean {
    return filterQueryFunction(
      rowAsNotification(row),
      parseFilterQuery(value.toString()),
    );
  }

  function updateFilter(filter: string) {
    let currentQuery = parseFilterQuery(currentSearch);
    let newQuery = parseFilterQuery(filter);
    let mergedQuery = mergeQuery(currentQuery, newQuery);
    currentSearch = queryToString(mergedQuery);
  }

  function markNotificationAsRead(notification: AppNotification) {
    notification.unread = false;
    updateNotificationInCache(notification);
    rebuild();
  }

  async function markClosedItemsAsRead() {
    const promises = [];

    for (const notification of notifications) {
      if (appNotificationIsClosed(notification)) {
        promises.push(markNotificationThreadAsRead(notification.id));
        notification.unread = false;
      }
    }

    await Promise.all(promises);
    storeNotificationsInCache(notifications);
    rebuild();
  }

  function cleanReadItems() {
    let remainingNotifications = notifications.filter((n) => n.unread);
    storeNotificationsInCache(remainingNotifications);
    rebuild();
  }

  function isNotificationNew(notification: AppNotification): boolean {
    return notification.unread && newNotificationIds.includes(notification.id);
  }

  // Rebuild notifications with no API calls
  function rebuild() {
    dispatch("rebuild");
  }

  // Rebuild notifications with API calls
  function refresh() {
    dispatch("refresh");
  }
</script>

<main class="main">
  <div class="header">
    {#if refreshing && notifications.length === 0}
      <h4>Loading notifications...</h4>
    {:else}
      <h4>You have <i>{notifications.length}</i> notifications</h4>
    {/if}
    <UserNotificationStatus />
  </div>

  <DataTable
    sortable
    headers={[
      { key: "new", value: "", width: "2rem", empty: true },
      {
        key: "updatedAt",
        value: "Date/Time",
        width: "10%",
        sort: (a, b) => (a < b ? 1 : a == b ? 0 : -1),
      },
      { key: "repository", value: "Repository" },
      {
        key: "message",
        value: "Message",
        width: "30%",
        sort: (a, b) => a.kind.localeCompare(b.kind),
      },
      { key: "state", value: "State", width: "8rem" },
      { key: "labels", value: "Labels" },
      { key: "actions", value: "Actions", width: "10rem", empty: true },
    ]}
    rows={notifications}
    {page}
    {pageSize}
  >
    <svelte:fragment slot="cell" let:row let:cell>
      <Cell
        notification={rowAsNotification(row)}
        showIndicator={isNotificationNew(rowAsNotification(row))}
        {cell}
        on:filter={(e) => updateFilter(e.detail)}
        on:marked-as-read={(e) => markNotificationAsRead(e.detail)}
      />
    </svelte:fragment>

    <Toolbar>
      <ToolbarContent>
        <ToolbarSearch
          persistent
          bind:value={currentSearch}
          shouldFilterRows={rowFilterFunction}
          bind:filteredRowIds
        />
        <Button
          iconDescription="Show help"
          icon={HelpFilled}
          kind="secondary"
          on:click={() => (showHelpModal = true)}
        />
        <LoadingButton
          iconDescription="Refresh"
          icon={WatsonHealthRotate_360}
          kind="secondary"
          loading={refreshing}
          on:click={() => refresh()}>Refresh</LoadingButton
        >
        <Button
          icon={Erase}
          kind="secondary"
          disabled={readItemCount == 0}
          on:click={() => (showCleanReadItemsModal = true)}
          >Clean read items ({readItemCount})</Button
        >
        <LoadingButton
          icon={CheckmarkFilled}
          kind="secondary"
          disabled={closedItemCount == 0}
          loading={markingClosedItemsAsRead}
          on:click={() => (showMarkClosedModal = true)}
        >
          Mark closed items as read ({closedItemCount})
        </LoadingButton>
      </ToolbarContent>
    </Toolbar>
  </DataTable>

  <Pagination
    bind:pageSize
    bind:page
    totalItems={filteredRowIds.length}
    pageSizeInputDisabled
  />
</main>

<HelpModal bind:open={showHelpModal} />

<Modal
  bind:open={showMarkClosedModal}
  modalHeading="Mark closed items as read"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  preventCloseOnClickOutside
  on:click:button--primary={async () => {
    markingClosedItemsAsRead = true;
    showMarkClosedModal = false;
    await markClosedItemsAsRead();
    markingClosedItemsAsRead = false;
  }}
  on:click:button--secondary={() => (showMarkClosedModal = false)}
  on:open
  on:close
  on:submit
>
  <p>
    Are you sure you want to mark all {closedItemCount} closed items as read?
  </p>
</Modal>

<Modal
  bind:open={showCleanReadItemsModal}
  modalHeading="Clean read items"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  preventCloseOnClickOutside
  on:click:button--primary={() => {
    cleanReadItems();
    showCleanReadItemsModal = false;
  }}
  on:click:button--secondary={() => (showCleanReadItemsModal = false)}
  on:open
  on:close
  on:submit
>
  <p>Are you sure you want to clean all {readItemCount} read items?</p>
</Modal>

<style>
  i {
    font-style: italic;
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    margin-bottom: var(--size-2);
  }

  .main :global(table tbody tr td) {
    padding-top: var(--size-2);
    padding-bottom: var(--size-2);
  }

  :global(.bx--toolbar-content) {
    gap: 0.1rem;
  }
</style>
