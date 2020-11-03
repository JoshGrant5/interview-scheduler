import React from "react";

import { render, cleanup, waitForElement, fireEvent, prettyDOM, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, getByRole } from "@testing-library/react";

import Application from "components/Application";
import axios from "__mocks__/axios";

afterEach(cleanup);

describe('Application', () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    let { container, rerender } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    let appointments = getAllByTestId(container, "appointment");
    let appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    axios.put({
      student: "Lydia Miller-Jones"
    })
    .then(() => {
      console.log(prettyDOM(container))
    })

    rerender(<Application />);

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    // await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
   
  });
})
