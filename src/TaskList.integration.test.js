import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import TaskList from "./TaskList";

const server = setupServer(
  rest.get("https://jsonplaceholder.typicode.com/todos", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, title: "Task 1", completed: false },
        { id: 2, title: "Task 2", completed: true },
      ])
    );
  }),
  rest.post("https://jsonplaceholder.typicode.com/todos", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ id: 3, title: "New Task", completed: false })
    );
  }),
  rest.delete(
    "https://jsonplaceholder.typicode.com/todos/1",
    (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json({ id: 2, title: "Task 2", completed: true })
      );
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders a list of tasks and allows adding new tasks", async () => {
  render(<TaskList />);
  const initialTasks = await screen.findAllByRole("listitem");
  expect(initialTasks.length).toBe(2);

  const newTaskInput = await screen.findByRole("textbox", {
    name: /new-task/i,
  });
  const addTaskButton = screen.getByRole("button", { name: /add task/i });

  fireEvent.change(newTaskInput, { target: { value: "New Task" } });
  fireEvent.click(addTaskButton);

  const loadingText = screen.getByText(/loading/i);

  await waitFor(() => expect(loadingText).not.toBeInTheDocument());

  const updatedTasks = await screen.findAllByRole("listitem");

  expect(updatedTasks.length).toBe(3);
});

test("renders a list of tasks and allows delete a task", async () => {
  render(<TaskList />);
  const initialTasks = await screen.findAllByRole("listitem");
  expect(initialTasks.length).toBe(2);

  const deleteButtons = await screen.findAllByRole("button", {
    name: /delete/i,
  });

  fireEvent.click(deleteButtons[0]);

  const loadingText = screen.getByText(/loading/i);

  await waitFor(() => expect(loadingText).not.toBeInTheDocument());

  const updatedTasks = await screen.findAllByRole("listitem");

  expect(updatedTasks.length).toBe(1);
});

test("renders a list of tasks and allows edit a task", async () => {
  render(<TaskList />);

  const loadingText = screen.getByText(/loading/i);

  await waitFor(() => expect(loadingText).not.toBeInTheDocument());

  const initialInput = screen.getByDisplayValue(/task 1/i);

  fireEvent.change(initialInput, { target: { value: "Task edit 1" } });

  expect(screen.getByDisplayValue(/task edit 1/i)).toBeInTheDocument();
});
