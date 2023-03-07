import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskList from "./TaskList";

test("renders a list of tasks and allows adding new tasks", async () => {
  render(<TaskList />);
  const initialTasks = await screen.findAllByRole("listitem");
  expect(initialTasks.length).toBe(10);

  const newTaskInput = screen.getByRole("textbox");
  const addTaskButton = screen.getByRole("button", { name: /add task/i });

  fireEvent.change(newTaskInput, { target: { value: "New Task" } });
  fireEvent.click(addTaskButton);

  const updatedTasks = await screen.findAllByRole("listitem");
  expect(updatedTasks.length).toBe(11);
});