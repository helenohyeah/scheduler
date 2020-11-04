import React from "react";
import {
  render,
  cleanup,
  prettyDOM,
  waitForElement,
  fireEvent,
  getByText,
  getByAltText,
  getAllByTestId,
  getByPlaceholderText,
  queryByText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  xit("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday"))
      .then(() => {
        fireEvent.click(getByText("Tuesday"));
        expect(getByText("Leopold Silvers")).toBeInTheDocument();
      })
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Monday"));
    
    const appointment = getAllByTestId(container, "appointment")[0];
    
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));

    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")
      .find(appointment => queryByText(appointment, "Archie Cohen"));
    
    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Are you sure you want to delete this interview?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Add"));

    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));

    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    //1 render application
    const { container, debug } = render(<Application />);

    //2 wait until text Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //3 click the Edit button on booked appointment
    const appointment = getAllByTestId(container, "appointment")
      .find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));

    //4 change the placeholder text to "Lydia Miller-Jones"
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    //5 click a different interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    //6 click Save button
    fireEvent.click(getByText(appointment, "Save"));

    //7 check that the element with text "Saving" is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //8 wait until element with text "Lydia Miller-Jones" is displayed
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    //9 check that interviewer name changed
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    //10 check that DayListItem with text "Monday" also has "1 spot remaining"
    const day = getAllByTestId(container, "day")
    .find(day => queryByText(day, "Monday"));
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  xit("shows the save error when failing to save an appointment", () => {

  });

  xit("shows the delete error when failing to delete an existing appointment", () => {

  });
});