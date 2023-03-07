import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders a list of tasks and allows adding new tasks", async () => {
  render(<TaskList />);
  const initialTasks = await screen.findAllByRole("listitem");
  expect(initialTasks.length).toBe(2);

  const newTaskInput = screen.getByRole("textbox");
  const addTaskButton = screen.getByRole("button", { name: /add task/i });

  fireEvent.change(newTaskInput, { target: { value: "New Task" } });
  fireEvent.click(addTaskButton);

  const updatedTasks = await screen.findAllByRole("listitem");
  expect(updatedTasks.length).toBe(3);
});
