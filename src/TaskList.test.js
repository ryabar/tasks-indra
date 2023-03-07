import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskList from "./TaskList";

test("renders a list of tasks and allows adding new tasks", async () => {
  render(<TaskList />);
  const initialTasks = await screen.findAllByRole("listitem");
  expect(initialTasks.length).toBe(10);

  const newTaskInput = await screen.findByRole("textbox", {
    name: /new-task/i,
  });
  const addTaskButton = screen.getByRole("button", { name: /add task/i });

  fireEvent.change(newTaskInput, { target: { value: "New Task" } });
  fireEvent.click(addTaskButton);

  const loadingText = screen.getByText(/loading/i);

  await waitFor(() => expect(loadingText).not.toBeInTheDocument());

  const updatedTasks = await screen.findAllByRole("listitem");
  expect(updatedTasks.length).toBe(11);
});
