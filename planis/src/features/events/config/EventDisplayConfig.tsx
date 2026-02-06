import type { CalendarEvent } from "../../../types";
import type {
  CounterFieldConfig,
  FieldConfig,
  FieldType,
  IndicatorFieldConfig,
  MoodFieldConfig,
  StatusFieldConfig,
} from "../../../types/FieldConfig";
import { EventCounterField } from "../components/EventCounterField";
import { EventIndicatorField } from "../components/EventIndicatorField";
import { EventMoodField } from "../components/EventMoodField";
import { EventStatusField } from "../components/EventStatusField";

interface DisplayConfig {
  displayOnEvent: boolean;
  displayElement?: (props: {
    field: FieldConfig;
    event: CalendarEvent;
  }) => React.ReactNode;
}

export const displayConfig: Partial<Record<FieldType, DisplayConfig>> = {
  counter: {
    displayOnEvent: true,
    displayElement: (props) => (
      <EventCounterField
        config={props.field as CounterFieldConfig}
        event={props.event}
      />
    ),
  },
  indicator: {
    displayOnEvent: true,
    displayElement: (props) => (
      <EventIndicatorField
        config={props.field as IndicatorFieldConfig}
        event={props.event}
      />
    ),
  },
  mood: {
    displayOnEvent: true,
    displayElement: (props) => (
      <EventMoodField
        config={props.field as MoodFieldConfig}
        event={props.event}
      />
    ),
  },
  status: {
    displayOnEvent: true,
    displayElement: (props) => (
      <EventStatusField
        config={props.field as StatusFieldConfig}
        event={props.event}
      />
    ),
  },
};
