import React from "react";
import axios from "axios";
import WS from "jest-websocket-mock";

import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText, queryAllByTestId, waitForElementToBeRemoved } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe('Application', () => {

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    // Mock a WebSocket server and render application
    const server = new WS("ws://localhost:8001");
    const { container } = render(<Application />);

    // Name is found after container renders
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // Add a new appointment and save that appointment
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    // Find saving screen 
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(container, 'Saving'));

    // Send data from mock server and update appointment
    server.send('{"type":"SET_INTERVIEW","id":1,"interview":{"student":"Lydia Miller-Jones","interviewer":1}}');
    expect(getByText(container, 'Lydia Miller-Jones', {exact: false})).toBeInTheDocument();

    // Update number of spots remaining
    const day = queryAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

    server.close();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // Mock a WebSocket server and render application
    const server = new WS("ws://localhost:8001");
    const { container } = render(<Application />);

    // Name and appointment are found after container renders
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    // Delete appointment and confirm deletion
    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you'd like to delete?")).toBeInTheDocument();
    fireEvent.click(queryByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    
    // Send data from mock server deleting appointment
    await waitForElementToBeRemoved(() => getByText(appointment, 'Deleting'));
    server.send('{"type":"SET_INTERVIEW","id":2,"interview":null}');
    expect(getByAltText(appointment, 'Add')).toBeInTheDocument();

    // Find updated number of spots remaining 
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    server.close();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // Mock a WebSocket server and render application
    const server = new WS("ws://localhost:8001");
    const { container } = render(<Application />);

    // Name and appointment found after rendering
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    // Edit and save a new appointment, viewing the saving screen
    fireEvent.click(queryByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(queryByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // Send data from mock server editing appointment
    await waitForElementToBeRemoved(() => getByText(appointment, 'Saving'));
    server.send('{"type":"SET_INTERVIEW","id":2,"interview":{"student":"Lydia Miller-Jones","interviewer":2}}');

    // Find that spots remaining stays the same
    const day = queryAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

    server.close();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    // Find name and appointment once container renders
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    // Try to add and save a new appointment
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    // Find the error message after saving screen is shown
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Error"));
  });
  
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);
    // Find name and appointment once container renders
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    // Try to delete appointment and view the error message
    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you'd like to delete?")).toBeInTheDocument();
    fireEvent.click(queryByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Error"));
  });
})
