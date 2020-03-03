import { parseCommitMessage } from 'commitlint-jira-utils'
import { TRuleResolver } from '../../@types'

const jiraTaskIdProjectKeyRuleResolver: TRuleResolver = (
  parsed,
  _when,
  value,
) => {
  const rawCommitMessage = parsed.raw
  if (!rawCommitMessage) return [false, 'Commit message should not be empty']

  const commitMessage = parseCommitMessage(rawCommitMessage)

  let isRuleValid = false
  let nonValidTaskId = null
  if (!value) {
    return [false, 'project key should be provided']
  }
  if (typeof value === 'string' || typeof value === 'number') {
    nonValidTaskId = commitMessage.commitTaskIds.find(
      // Task ID should start with project key
      taskId =>
        taskId.toUpperCase().indexOf(value.toString().toUpperCase()) !== 0,
    )
    isRuleValid = !nonValidTaskId
  } else {
    nonValidTaskId = commitMessage.commitTaskIds.find(taskId => {
      return !value.find(
        val => taskId.toUpperCase().indexOf(val.toString().toUpperCase()) === 0,
      )
    })
    isRuleValid = !nonValidTaskId
  }

  return [
    isRuleValid,
    `${nonValidTaskId} taskId must include project key ${value}`,
  ]
}

export default jiraTaskIdProjectKeyRuleResolver
