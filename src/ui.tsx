import {
  Button,
  Checkbox,
  Container,
  Divider,
  Dropdown,
  DropdownOption,
  IconSearchLarge32,
  render,
  SegmentedControl,
  SegmentedControlOption,
  Stack,
  Text,
  TextboxMultiline,
  TextboxNumeric,
  Toggle,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import {
  emit,
  getSceneNodeById,
} from "@create-figma-plugin/utilities";
import { createContext, Fragment, h, JSX } from "preact";
import { useState } from "preact/hooks";
import HorizontalSpace from "./components/HorizontalSpace";
import LabeledInputGroup from "./components/LabeledInputGroup";
import LabeledSwitch from "./components/LabeledSwitch";
import Panel from "./components/Panel";
import { PanelData, Panels } from "./constants";
import styles from "./styles.module.css";
import CategoryRow from "./components/CategoryRow";
import { HourglassMedium } from "phosphor-react";
import CategoryTitle from "./components/CategoryTitle";

interface PanelContextProps {
  panel: PanelData | null;
}

const PanelContext = createContext<Partial<PanelContextProps>>({
  panel: null,
});

function TimesPanel({ show, setOpenPanel }) {
  const [startTime, setStartTime] = useState({
    enabled: false,
    time: {
      hour: "10",
      minute: "00",
    },
    amPm: "AM",
  });

  const [interval, setInterval] = useState("30 mins");

  // TODO
  // Change this Time Format option to something like "Timestamp"
  // Timestamps can be in the past or future, and have custom formatting.
  // But might need to also include dates, so not sure if I maybe need to merge
  // the Date and Time categories into a single category.¡

  const [timeFormat, setTimeFormat] = useState("12:00 PM");
  const timeFormatOptions: Array<SegmentedControlOption> = [
    { value: "12:00 PM" },
    { value: "20 minutes ago" },
    { value: "24:00" },
    { value: "2 days from now" },
  ];
  function handleIntervalChange(
    event: JSX.TargetedEvent<HTMLInputElement>
  ) {
    const newValue = event.currentTarget.value;

    setInterval(newValue);
  }

  function handleAmPmChange(
    event: JSX.TargetedEvent<HTMLInputElement>
  ) {
    const newValue = event.currentTarget.value;

    setStartTime({
      ...startTime,
      amPm: newValue,
    });
  }

  const amPmOptions: Array<SegmentedControlOption> = [
    { value: "AM" },
    { value: "PM" },
  ];

  function handleChangeHour(
    event: JSX.TargetedEvent<HTMLInputElement>
  ) {
    const newValue = event.currentTarget.value;

    setStartTime({
      ...startTime,
      time: {
        ...startTime.time,
        hour: newValue,
      },
    });
  }

  function handleChangeMinute(
    event: JSX.TargetedEvent<HTMLInputElement>
  ) {
    const newValue = event.currentTarget.value;

    setStartTime({
      ...startTime,
      time: {
        ...startTime.time,
        minute: newValue,
      },
    });
  }

  return (
    <Panel
      show={show}
      setOpenPanel={setOpenPanel}
      panel={Panels.TIMES}
      eventArgs={{ ...startTime, interval: interval }}>
      <CategoryTitle panel={Panels.TIMES} />

      <div className={styles.main}>
        <VerticalSpace space="medium" />
        <Divider />
        <VerticalSpace space="medium" />

        <Container space="small">
          <LabeledInputGroup title="Constraints">
            <LabeledSwitch
              title="Start time and intervals"
              value={startTime.enabled}
              handleChange={() => {
                setStartTime({
                  ...startTime,
                  enabled: !startTime.enabled,
                });
              }}
            />
            {startTime.enabled && (
              <>
                <VerticalSpace space="small" />
                <div className={styles.inlineCenter}>
                  <TextboxNumeric
                    onInput={handleChangeHour}
                    value={startTime.time.hour}
                  />
                  <HorizontalSpace space="small" />
                  <TextboxNumeric
                    onInput={handleChangeMinute}
                    value={startTime.time.minute}
                  />
                  <HorizontalSpace space="small" />
                  <SegmentedControl
                    onChange={handleAmPmChange}
                    options={amPmOptions}
                    value={startTime.amPm}
                  />
                </div>
                <VerticalSpace space="medium" />
                <LabeledInputGroup title="Interval">
                  <TextboxNumeric
                    onInput={handleIntervalChange}
                    value={interval}
                    suffix=" mins"
                    minimum={0}
                  />
                </LabeledInputGroup>
              </>
            )}
          </LabeledInputGroup>
          <LabeledInputGroup title="Time format">
            <Dropdown
              onChange={(e: JSX.TargetedEvent<HTMLInputElement>) =>
                setTimeFormat("YYYY-MM-DD")
              }
              options={timeFormatOptions}
              value={timeFormatOptions[0].value}
            />
          </LabeledInputGroup>
        </Container>
      </div>
    </Panel>
  );
}

function NamePanel({ show, setOpenPanel, icon }) {
  const options: Array<DropdownOption> = [
    { value: "Any" },
    { value: "Male" },
    { value: "Female" },
  ];

  const [showLastNameOptions, setShowLastNameOptions] = useState(
    false
  );

  const [genderValue, setGenderValue] = useState("Any");
  const [nameOptions, setNameOptions] = useState({
    gender: "Any",
    firstName: true,
    // middleName: false,
    lastName: true,
    lastInitial: "Full",
  });

  const lnOptions: Array<SegmentedControlOption> = [
    { value: "Full" },
    { value: "Initial" },
  ];

  return (
    <Panel
      show={show}
      setOpenPanel={setOpenPanel}
      panel={Panels.NAMES}
      eventArgs={nameOptions}>
      <Container>
        <CategoryTitle panel={Panels.NAMES} icon={icon} />
      </Container>

      <VerticalSpace space="medium" />
      <Divider />

      <div className={styles.main}>
        <VerticalSpace space="medium" />
        <Container>
          <LabeledInputGroup title="Gender association">
            <Dropdown
              onChange={(e: JSX.TargetedEvent<HTMLInputElement>) =>
                setNameOptions({
                  ...nameOptions,
                  gender: e.currentTarget.value,
                })
              }
              options={options}
              value={nameOptions.gender}
            />
          </LabeledInputGroup>

          <Text bold>Options</Text>
          <VerticalSpace space="small" />

          <LabeledSwitch
            title="First name"
            subtitle="eg. Kennedy"
            handleChange={(e: JSX.TargetedEvent<HTMLInputElement>) =>
              setNameOptions({
                ...nameOptions,
                firstName: e.currentTarget.checked,
              })
            }
            value={nameOptions.firstName}
          />

          <VerticalSpace space="small" />

          {/* <LabeledSwitch
            title="Middle initial"
            subtitle="eg. G."
            handleChange={(e: JSX.TargetedEvent<HTMLInputElement>) =>
              setNameOptions({
                ...nameOptions,
                middleName: e.currentTarget.checked,
              })
            }
            value={nameOptions.middleName}
          />

          <VerticalSpace space="small" /> */}

          <LabeledSwitch
            title="Last name"
            subtitle="eg. Morocco"
            handleChange={(
              e: JSX.TargetedEvent<HTMLInputElement>
            ) => {
              setNameOptions({
                ...nameOptions,
                lastName: e.currentTarget.checked,
              });
              setShowLastNameOptions(!showLastNameOptions);
            }}
            value={showLastNameOptions}
          />
          {showLastNameOptions && (
            <>
              <VerticalSpace space="extraSmall" />
              <SegmentedControl
                options={lnOptions}
                value={nameOptions.lastInitial}
                onChange={(e: JSX.TargetedEvent<HTMLInputElement>) =>
                  setNameOptions({
                    ...nameOptions,
                    lastInitial: e.currentTarget.value,
                  })
                }
              />
            </>
          )}
        </Container>
      </div>
    </Panel>
  );
}

function ComponentVariabelsPanel({ show, setOpenPanel, icon }) {
  const [options, setOptions] = useState({
    value: "",
    nodes: [],
  });

  const typeOptions: Array<DropdownOption> = [
    { value: "Names", event: Panels.NAMES.event },
    { value: "Times", event: Panels.TIMES.event },
    { value: "Custom List", event: Panels.CUSTOM_LIST.event },
  ];

  const [selectedLayers, setSelectedLayers] = useState([]);

  function handleChange(
    event: JSX.TargetedEvent<HTMLInputElement>,
    node: SceneNode | Node
  ) {
    if (event.currentTarget.checked) {
      // setSelectedLayers(selectedLayers.concat(node));

      if (selectedLayers.some((layer) => layer.id === node.id)) {
        let nodeIndex = selectedLayers.indexOf(node);
        let nodesCopy = [...selectedLayers];
        let nodeCopy = {
          ...nodesCopy[nodeIndex],
        };
        nodeCopy.operation = typeOptions.find(
          (option) => option.value === event.currentTarget.value
        );

        nodesCopy[nodeIndex] = nodeCopy;

        setSelectedLayers(nodesCopy);

        console.log(selectedLayers);
      } else {
        let nodeCopy = {
          ...node,
        };

        nodeCopy.operation = typeOptions[0]; //works

        setSelectedLayers(selectedLayers.concat(nodeCopy));

        console.log("selected");
        console.log(selectedLayers);
      }
    } else if (selectedLayers.some((layer) => layer.id === node.id)) {
      setSelectedLayers(
        selectedLayers.filter(function (item) {
          return item.id !== node.id;
        })
      );
    }

    return;
  }

  onmessage = (event) => {
    setOptions({ ...options, nodes: event.data.pluginMessage.nodes });
    console.log(event.data.pluginMessage);

    // console.log(options.nodes);
  };

  function dispatchAllEvents() {
    selectedLayers.forEach((node) => {
      if (node.operation) {
        console.log(node.operation);

        emit(node.operation.event, node);
      }
    });
  }

  return (
    <Panel
      show={show}
      setOpenPanel={setOpenPanel}
      panel={Panels.COMPONENT_VARIABLES}
      eventArgs={options}>
      <Container>
        <CategoryTitle
          panel={Panels.COMPONENT_VARIABLES}
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 192 192"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M54 30C6 30 54 96 6 96C54 96 6 162 54 162"
                stroke="black"
                stroke-width="12"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M138 30C186 30 138 96 186 96C138 96 186 162 138 162"
                stroke="black"
                stroke-width="12"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="59"
                y1="64"
                x2="132"
                y2="64"
                stroke="black"
                stroke-width="12"
                stroke-linecap="round"
              />
              <line
                x1="59"
                y1="96"
                x2="132"
                y2="96"
                stroke="black"
                stroke-width="12"
                stroke-linecap="round"
              />
              <line
                x1="59"
                y1="128"
                x2="132"
                y2="128"
                stroke="black"
                stroke-width="12"
                stroke-linecap="round"
              />
            </svg>
          }
        />
      </Container>

      <VerticalSpace space="medium" />
      <Divider />
      <VerticalSpace space="medium" />
      <Container space="small">
        {options.nodes.length > 0 &&
          options.nodes.map((node, i) => {
            console.log(node);

            // {value, event}

            return (
              <>
                <Checkbox
                  onChange={(e) => handleChange(e, node)}
                  value={selectedLayers.some(
                    (layer) => layer.id === node.id
                  )}>
                  <Text>{node.name}</Text>
                </Checkbox>
                <VerticalSpace space="small" />
                {selectedLayers.some(
                  (layer) => layer.id === node.id
                ) && (
                  <>
                    <Dropdown
                      onChange={(
                        e: JSX.TargetedEvent<HTMLInputElement>
                      ) => {
                        let nodeIndex = selectedLayers.findIndex(
                          (layer) => layer.id === node.id
                        );
                        let nodesCopy = [...selectedLayers];
                        let nodeCopy = {
                          ...nodesCopy[nodeIndex],
                        };
                        nodeCopy.operation = typeOptions.find(
                          (option) =>
                            option.value === e.currentTarget.value
                        );

                        nodesCopy[nodeIndex] = nodeCopy;

                        setSelectedLayers(nodesCopy);

                        console.log(selectedLayers);
                      }}
                      options={typeOptions}
                      value={
                        selectedLayers.find(
                          (layer) => layer.id === node.id
                        ).operation.value
                      }
                    />
                    <VerticalSpace space="small" />
                  </>
                )}
              </>
            );
          })}

        <Button
          secondary
          onClick={() => emit("GET_TEXT_LAYER_SELECTIONS", options)}>
          {options.nodes.length > 0
            ? "Update selections"
            : "Get selections"}
        </Button>

        <Button onClick={() => dispatchAllEvents()}>
          Fill selected layers
        </Button>
      </Container>
    </Panel>
  );
}

function CustomListPanel({ show, setOpenPanel, icon }) {
  const [options, setOptions] = useState({ value: "" });

  return (
    <Panel
      show={show}
      setOpenPanel={setOpenPanel}
      panel={Panels.CUSTOM_LIST}
      eventArgs={options}>
      <CategoryTitle panel={Panels.CUSTOM_LIST} icon={<></>} />

      <VerticalSpace space="medium" />
      <Divider />
      <VerticalSpace space="medium" />
      <Container space="small">
        <LabeledInputGroup title="Enter your list">
          <TextboxMultiline
            value={options.value}
            placeholder="Enter a list, with terms separated by a new line"
            onInput={(e) =>
              setOptions({ ...options, value: e.currentTarget.value })
            }
          />
        </LabeledInputGroup>
      </Container>
    </Panel>
  );
}

function Plugin(props: { greeting: string }) {
  const [openPanel, setOpenPanel] = useState<null | PanelData>(null);

  return (
    <PanelContext.Provider
      value={{
        panel: null,
      }}>
      <NamePanel
        show={openPanel === Panels.NAMES}
        setOpenPanel={setOpenPanel}
        icon={<IconSearchLarge32 />}
      />

      <TimesPanel
        show={openPanel === Panels.TIMES}
        setOpenPanel={setOpenPanel}
      />

      <ComponentVariabelsPanel
        show={openPanel === Panels.COMPONENT_VARIABLES}
        setOpenPanel={setOpenPanel}
        icon={
          <svg
            width="192"
            height="192"
            viewBox="0 0 192 192"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M54 30C6 30 54 96 6 96C54 96 6 162 54 162"
              stroke="black"
              stroke-width="12"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M138 30C186 30 138 96 186 96C138 96 186 162 138 162"
              stroke="black"
              stroke-width="12"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line
              x1="59"
              y1="64"
              x2="132"
              y2="64"
              stroke="black"
              stroke-width="12"
              stroke-linecap="round"
            />
            <line
              x1="59"
              y1="96"
              x2="132"
              y2="96"
              stroke="black"
              stroke-width="12"
              stroke-linecap="round"
            />
            <line
              x1="59"
              y1="128"
              x2="132"
              y2="128"
              stroke="black"
              stroke-width="12"
              stroke-linecap="round"
            />
          </svg>
        }
      />

      <CustomListPanel
        show={openPanel === Panels.CUSTOM_LIST}
        setOpenPanel={setOpenPanel}
        icon={<></>}
      />

      <div className={styles.container}>
        <div className={styles.main}>
          <Container space="small">
            <VerticalSpace space="small" />
            <div
              style={{
                backgroundColor: "#dbecfc",
                padding: 12,
                borderRadius: 6,
                background: "#E1F3FF",
                display: "flex",
              }}>
              <div
                style={{
                  paddingRight: 8,
                }}>
                <svg
                  width="18"
                  height="25"
                  viewBox="0 0 18 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.0839 12.9002L6.33889 14.8301C6.49248 14.9622 6.66856 15.0541 6.85025 15.102C7.1181 15.1709 7.39907 15.1403 7.63696 14.9852C7.6482 14.9775 7.65943 14.9699 7.67255 14.9622C7.89919 14.8014 8.04717 14.5506 8.10149 14.2729C8.15581 13.9934 8.11273 13.6909 7.95164 13.4343C7.94227 13.4209 7.93478 13.4075 7.92542 13.3941L6.29019 10.9989C6.09351 10.7098 5.81442 10.5145 5.51846 10.438C5.25061 10.3671 4.96964 10.3997 4.73176 10.5548C4.72052 10.5624 4.70928 10.5701 4.69617 10.5777C4.46952 10.7386 4.32154 10.9913 4.26722 11.267C4.2129 11.5465 4.25598 11.849 4.41707 12.1056C4.42644 12.119 4.43393 12.1324 4.4433 12.1458L4.5126 12.2492C4.71677 12.4177 4.9097 12.634 5.0839 12.9002ZM7.86922 2.50185C7.85049 2.50759 7.82989 2.51142 7.81116 2.51525C7.52082 2.59184 7.28668 2.79096 7.13683 3.05326C6.97387 3.33854 6.91206 3.69466 6.99073 4.05269L8.51732 11.1196C8.76645 10.9204 9.04929 10.7768 9.36959 10.6926C9.79666 10.5796 10.2762 10.5835 10.8138 10.7118C10.5871 9.67977 10.3661 8.63821 10.1469 7.59666C9.84911 6.18941 9.55128 4.78216 9.27406 3.54915C9.26657 3.52617 9.26282 3.5032 9.2572 3.48022C9.17291 3.13942 8.97249 2.85988 8.714 2.68374C8.46487 2.51334 8.16705 2.44058 7.86922 2.50185ZM14.4682 1.00653C14.5019 1.00653 14.5356 1.01036 14.5675 1.0161C15.1725 1.09269 15.6932 1.42009 16.0491 1.893C16.3994 2.35825 16.5886 2.96327 16.538 3.60276C16.538 3.63531 16.5343 3.66594 16.5286 3.69657L15.7607 11.604H15.7625C15.7607 11.6155 15.7607 11.625 15.7588 11.6365C15.8693 11.7246 15.9723 11.8222 16.0678 11.9295C16.4668 12.3736 16.7253 12.9653 16.8377 13.645C17.0025 14.6444 17.0475 15.8315 16.9463 16.986C16.8527 18.0524 16.6373 19.0978 16.2795 19.9575C15.4235 22.0138 13.9044 23.4191 12.1493 24.0835C11.3307 24.3936 10.4635 24.543 9.59062 24.5219C8.714 24.5009 7.83176 24.3113 6.98699 23.9437C5.31804 23.2162 3.79145 21.7974 2.75 19.6205C2.24238 18.5579 2.16371 17.8954 1.95018 16.7792C1.91646 16.5973 1.97266 16.4192 2.08692 16.2929L1.39574 15.2303C0.828183 14.3572 0.921839 13.4535 1.3564 12.7815C1.52311 12.5249 1.74039 12.3047 1.98951 12.1362C2.24051 11.9658 2.52523 11.8452 2.82492 11.7916C2.9523 11.7686 3.07967 11.7571 3.20891 11.759C3.18082 11.5236 3.19018 11.2881 3.23514 11.0583C3.34003 10.5184 3.63973 10.0225 4.09677 9.697C4.11925 9.67977 4.1436 9.66445 4.16795 9.64722C4.6662 9.32365 5.23937 9.25281 5.77695 9.39258C6.30705 9.53043 6.80155 9.87506 7.14807 10.3824L7.27545 10.5682L5.91931 4.29011C5.77883 3.64488 5.89121 2.99965 6.18717 2.4827C6.48874 1.95427 6.97949 1.55602 7.59388 1.41051C7.60699 1.40668 7.62197 1.40477 7.63508 1.40285C8.23448 1.27458 8.83388 1.41626 9.32276 1.7494C9.81164 2.08446 10.1881 2.6129 10.3324 3.25621H10.3342C10.3361 3.2677 10.338 3.2811 10.3417 3.29259C10.6433 4.63474 10.9318 5.99603 11.2202 7.35542C11.312 7.79387 11.4057 8.2304 11.4974 8.6631L12.0257 3.23515C12.0257 3.2026 12.0294 3.17197 12.035 3.14133C12.11 2.50568 12.4115 1.95044 12.8442 1.5656C13.2844 1.17693 13.8594 0.958662 14.4682 1.00653ZM15.18 2.58035C14.9983 2.33911 14.7398 2.17253 14.442 2.13233C14.4307 2.13233 14.4195 2.13041 14.4083 2.13041V2.12658C14.0955 2.09403 13.7958 2.207 13.5654 2.41186C13.3312 2.62055 13.1683 2.92115 13.1252 3.26961C13.1252 3.2811 13.1233 3.2945 13.1233 3.30599H13.1196L12.4003 10.6983L14.723 10.9338L15.4385 3.58552C15.4385 3.57021 15.4404 3.55681 15.4404 3.54149H15.4422C15.4778 3.17962 15.3748 2.83691 15.18 2.58035ZM7.03007 16.2125C7.08813 16.5207 7.08064 16.8347 7.01508 17.1334C6.8952 17.681 6.58052 18.1788 6.10849 18.5004C6.101 18.5043 6.07665 18.5215 6.03544 18.5464L6.03732 18.5483C6.02795 18.554 6.02046 18.5579 6.01297 18.5617C5.50722 18.8661 4.93031 18.9178 4.39459 18.7647C4.05181 18.667 3.72402 18.4832 3.44492 18.2286C4.10052 20.2734 5.27121 21.9812 7.4178 22.9156C8.13333 23.2276 8.87696 23.3885 9.61122 23.4057C10.3492 23.4229 11.0797 23.2985 11.7672 23.0362C13.2507 22.4733 14.5375 21.2766 15.2699 19.519C15.5827 18.7685 15.7719 17.8418 15.8562 16.8902C15.948 15.8315 15.9086 14.7459 15.7569 13.8288C15.6782 13.3578 15.5134 12.9633 15.2624 12.6838C15.0414 12.4368 14.7417 12.2722 14.3708 12.2205C13.5485 12.1075 12.0613 12.1343 9.92965 12.1726C9.69926 12.1764 9.46324 12.1803 9.21787 12.186C9.09049 12.6168 9.07551 12.9921 9.14294 13.3118C9.20663 13.6124 9.34524 13.869 9.53817 14.0777C9.74234 14.2998 10.0046 14.474 10.2987 14.5984C10.8344 14.8224 11.4656 14.8799 12.0425 14.7593C12.3291 14.6808 12.6269 14.8473 12.7131 15.1403C12.7993 15.437 12.6344 15.751 12.3441 15.841L12.1868 15.303L12.3441 15.841C10.1806 16.5035 10.1732 16.7811 10.1432 17.8284C10.1413 17.8992 10.1394 17.972 10.1376 18.016C10.1282 18.3262 9.87533 18.5674 9.57188 18.5579C9.27031 18.5483 9.03243 18.2898 9.04179 17.9797C9.04367 17.8973 9.04554 17.8456 9.04741 17.7959C9.07738 16.7122 9.09237 16.1397 9.87346 15.6304C9.53068 15.4868 9.21599 15.2915 8.94439 15.0503C8.7908 15.3605 8.56415 15.6342 8.27569 15.841C8.25134 15.8583 8.22886 15.8736 8.20451 15.8908C7.83738 16.1282 7.43279 16.2297 7.03007 16.2125ZM5.53158 15.5328C5.41732 15.4198 5.31242 15.2954 5.21877 15.1575L3.76335 13.0265C3.51236 12.858 3.24825 12.8102 3.00474 12.8542C2.84927 12.8829 2.7013 12.9442 2.56831 13.0342C2.43532 13.1242 2.31918 13.241 2.23115 13.3769C2.01199 13.7139 1.97078 14.1772 2.27048 14.6386L3.89073 17.1315C4.0874 17.4359 4.37024 17.6446 4.67182 17.7288C4.94154 17.8054 5.22626 17.7825 5.47351 17.635C5.47913 17.6312 5.48287 17.6274 5.48849 17.6255V17.6274C5.49224 17.6255 5.49786 17.6216 5.52408 17.6025C5.76384 17.4397 5.92493 17.1832 5.98487 16.8998C6.04668 16.6145 6.00735 16.3005 5.84626 16.0287C5.83315 16.0076 5.82565 15.9923 5.82004 15.9865L5.53158 15.5328Z"
                    fill="black"
                    stroke="black"
                    stroke-width="0"
                  />
                </svg>
              </div>
              <div>
                <h3 style={{ marginBottom: "2px" }}>
                  <strong>Welcome to Schema!</strong>
                </h3>
                <p style={{ margin: 0 }}>
                  Automate tedious tasks, and improve the fidelity of
                  your designs, with true-to-life generative
                  placeholder text.
                </p>
              </div>
            </div>
            <VerticalSpace space="small" />
            <h3 style={{ marginBottom: "2px" }}>Categories</h3>
          </Container>

          <CategoryRow
            panel={Panels.NAMES}
            setOpenPanel={setOpenPanel}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#333333"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <line
                  x1="152"
                  y1="112"
                  x2="192"
                  y2="112"
                  fill="none"
                  stroke="#333333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"></line>
                <line
                  x1="152"
                  y1="144"
                  x2="192"
                  y2="144"
                  fill="none"
                  stroke="#333333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"></line>
                <circle
                  cx="92.10043"
                  cy="120"
                  r="24"
                  fill="none"
                  stroke="#333333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"></circle>
                <path
                  d="M61.10869,167.99952a32.01032,32.01032,0,0,1,61.98292-.00215"
                  fill="none"
                  stroke="#333333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"></path>
                <rect
                  x="32"
                  y="48.00005"
                  width="192"
                  height="160"
                  rx="8"
                  stroke-width="16"
                  stroke="#333333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"></rect>
              </svg>
            }
          />

          <CategoryRow
            panel={Panels.TIMES}
            setOpenPanel={setOpenPanel}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#333333"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path
                  d="M128,128,67.2,82.4A8,8,0,0,1,64,76V40a8,8,0,0,1,8-8H184a8,8,0,0,1,8,8V75.6412a8,8,0,0,1-3.17594,6.38188L128,128h0"
                  fill="none"
                  stroke="#333333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"></path>
                <path
                  d="M128,128,67.2,173.6A8,8,0,0,0,64,180v36a8,8,0,0,0,8,8H184a8,8,0,0,0,8-8V180.3588a8,8,0,0,0-3.17594-6.38188L128,128h0"
                  fill="none"
                  stroke="#333333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"></path>
                <line
                  x1="74.66065"
                  y1="87.99548"
                  x2="180.92301"
                  y2="87.99548"
                  fill="none"
                  stroke="#333333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"></line>
                <line
                  x1="128"
                  y1="167.99548"
                  x2="128"
                  y2="128"
                  fill="none"
                  stroke="#333333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"></line>
              </svg>
            }
          />

          <CategoryRow
            panel={Panels.COMPONENT_VARIABLES}
            setOpenPanel={setOpenPanel}
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 192 192"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M54 30C6 30 54 96 6 96C54 96 6 162 54 162"
                  stroke="black"
                  stroke-width="12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M138 30C186 30 138 96 186 96C138 96 186 162 138 162"
                  stroke="black"
                  stroke-width="12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <line
                  x1="59"
                  y1="64"
                  x2="132"
                  y2="64"
                  stroke="black"
                  stroke-width="12"
                  stroke-linecap="round"
                />
                <line
                  x1="59"
                  y1="96"
                  x2="132"
                  y2="96"
                  stroke="black"
                  stroke-width="12"
                  stroke-linecap="round"
                />
                <line
                  x1="59"
                  y1="128"
                  x2="132"
                  y2="128"
                  stroke="black"
                  stroke-width="12"
                  stroke-linecap="round"
                />
              </svg>
            }
          />

          <CategoryRow
            panel={Panels.CUSTOM_LIST}
            setOpenPanel={setOpenPanel}
            icon={<></>}
          />

          <CategoryRow
            panel={Panels.ORGANIZATIONS}
            setOpenPanel={setOpenPanel}
            icon={<></>}
          />

          <CategoryRow
            panel={Panels.NUMBERS}
            setOpenPanel={setOpenPanel}
            icon={<></>}
          />

          <CategoryRow
            panel={Panels.API}
            setOpenPanel={setOpenPanel}
            icon={<></>}
          />

          <CategoryRow
            panel={Panels.CONTACT_INFORMATION}
            setOpenPanel={setOpenPanel}
            icon={<></>}
          />

          <CategoryRow
            panel={Panels.TRENDING_TOPICS}
            setOpenPanel={setOpenPanel}
            icon={<></>}
          />

          <VerticalSpace space="medium" />
        </div>
      </div>
    </PanelContext.Provider>
  );
}

export default render(Plugin);
