import React, { useState } from 'react';
import { Plus, Trash2, Settings } from 'lucide-react';
import { ApprovalWorkflow, ApprovalStage, UserRole, ApprovalRuleType } from '../../types';

export const WorkflowConfig: React.FC = () => {
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([
    {
      id: '1',
      companyId: '1',
      name: 'Standard Approval Flow',
      isActive: true,
      stages: [
        {
          id: '1',
          workflowId: '1',
          stageNumber: 1,
          roleRequired: 'manager',
          approvalRuleType: 'all',
          approvalRuleValue: {},
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          workflowId: '1',
          stageNumber: 2,
          roleRequired: 'finance',
          approvalRuleType: 'percentage',
          approvalRuleValue: { percentage: 60 },
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          workflowId: '1',
          stageNumber: 3,
          roleRequired: 'director',
          approvalRuleType: 'specific_approver',
          approvalRuleValue: { specificUserId: 'director-1' },
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(workflows[0]?.id || null);
  const [newStage, setNewStage] = useState({
    roleRequired: 'manager' as UserRole,
    approvalRuleType: 'all' as ApprovalRuleType,
    percentage: 50,
  });

  const selectedWorkflowData = workflows.find(w => w.id === selectedWorkflow);

  const handleAddStage = () => {
    if (!selectedWorkflow) return;

    const workflow = workflows.find(w => w.id === selectedWorkflow);
    if (!workflow) return;

    const newStageNumber = workflow.stages.length + 1;
    const stage: ApprovalStage = {
      id: Date.now().toString(),
      workflowId: selectedWorkflow,
      stageNumber: newStageNumber,
      roleRequired: newStage.roleRequired,
      approvalRuleType: newStage.approvalRuleType,
      approvalRuleValue:
        newStage.approvalRuleType === 'percentage'
          ? { percentage: newStage.percentage }
          : {},
      createdAt: new Date().toISOString(),
    };

    setWorkflows(
      workflows.map(w =>
        w.id === selectedWorkflow ? { ...w, stages: [...w.stages, stage] } : w
      )
    );
  };

  const handleDeleteStage = (stageId: string) => {
    if (!selectedWorkflow) return;

    setWorkflows(
      workflows.map(w =>
        w.id === selectedWorkflow
          ? { ...w, stages: w.stages.filter(s => s.id !== stageId) }
          : w
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Approval Workflow Configuration</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg border-2 border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Workflows</h3>
            <div className="space-y-2">
              {workflows.map(workflow => (
                <button
                  key={workflow.id}
                  onClick={() => setSelectedWorkflow(workflow.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedWorkflow === workflow.id
                      ? 'bg-blue-600 text-white border-2 border-blue-500'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600'
                  }`}
                >
                  <div className="font-semibold">{workflow.name}</div>
                  <div className="text-xs opacity-75">
                    {workflow.stages.length} stage{workflow.stages.length !== 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedWorkflowData && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg border-2 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Add New Stage</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={newStage.roleRequired}
                    onChange={e =>
                      setNewStage({ ...newStage, roleRequired: e.target.value as UserRole })
                    }
                    className="px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="manager">Manager</option>
                    <option value="finance">Finance</option>
                    <option value="director">Director</option>
                    <option value="admin">Admin</option>
                  </select>

                  <select
                    value={newStage.approvalRuleType}
                    onChange={e =>
                      setNewStage({
                        ...newStage,
                        approvalRuleType: e.target.value as ApprovalRuleType,
                      })
                    }
                    className="px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Must Approve</option>
                    <option value="percentage">Percentage</option>
                    <option value="specific_approver">Specific Approver</option>
                    <option value="hybrid">Hybrid Rule</option>
                  </select>

                  {newStage.approvalRuleType === 'percentage' && (
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newStage.percentage}
                      onChange={e =>
                        setNewStage({ ...newStage, percentage: parseInt(e.target.value) })
                      }
                      className="px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      placeholder="Percentage"
                    />
                  )}

                  <button
                    onClick={handleAddStage}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors border-2 border-blue-500"
                  >
                    <Plus size={18} />
                    Add Stage
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg border-2 border-gray-700 overflow-hidden">
                <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
                  <h3 className="text-lg font-semibold text-white">
                    {selectedWorkflowData.name} - Stages
                  </h3>
                </div>
                <div className="divide-y divide-gray-700">
                  {selectedWorkflowData.stages.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-400">
                      No stages configured. Add a stage to get started.
                    </div>
                  ) : (
                    selectedWorkflowData.stages.map(stage => (
                      <div
                        key={stage.id}
                        className="px-6 py-4 hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-3 py-1 bg-blue-900 text-blue-200 text-sm font-bold rounded-full border border-blue-700">
                                Stage {stage.stageNumber}
                              </span>
                              <span className="text-white font-semibold">
                                {stage.roleRequired.charAt(0).toUpperCase() +
                                  stage.roleRequired.slice(1)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400">
                              <strong>Rule:</strong>{' '}
                              {stage.approvalRuleType === 'all' && 'All must approve'}
                              {stage.approvalRuleType === 'percentage' &&
                                `${stage.approvalRuleValue.percentage}% must approve`}
                              {stage.approvalRuleType === 'specific_approver' &&
                                'Specific approver required'}
                              {stage.approvalRuleType === 'hybrid' && 'Hybrid approval rule'}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteStage(stage.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors border border-red-500"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
