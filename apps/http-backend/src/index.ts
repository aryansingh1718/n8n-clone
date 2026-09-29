import express from 'express';
import cors from 'cors';
import workFlowRoutes from './routes/workflow.routes';
import executionRoutes from './routes/execution.routes';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/workFlows",workFlowRoutes)
app.use("/executions",executionRoutes)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});