import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Switch,
  Select,
  SelectItem,
  Textarea,
  Slider,
  Button,
  Input,
  Tabs,
  Tab
} from "@nextui-org/react";
import { ChatBotConfig, AutoReplyRule } from './types';

interface BotSettingsProps {
  config: ChatBotConfig;
  autoReplyRules?: AutoReplyRule[];
  onUpdate: (config: ChatBotConfig) => void;
  onUpdateAutoReply?: (rules: AutoReplyRule[]) => void;
}

export const BotSettings: React.FC<BotSettingsProps> = ({ 
  config, 
  autoReplyRules = [],
  onUpdate,
  onUpdateAutoReply 
}) => {
  const [currentConfig, setCurrentConfig] = useState(config);
  const [rules, setRules] = useState(autoReplyRules);
  const [selectedTab, setSelectedTab] = useState("general");

  const handleAddRule = () => {
    const newRule: AutoReplyRule = {
      id: `rule_${Date.now()}`,
      pattern: '',
      response: '',
      isEnabled: true,
      schedule: 'always'
    };
    setRules([...rules, newRule]);
  };

  const handleUpdateRule = (index: number, updates: Partial<AutoReplyRule>) => {
    const updatedRules = rules.map((rule, i) => 
      i === index ? { ...rule, ...updates } : rule
    );
    setRules(updatedRules);
    onUpdateAutoReply?.(updatedRules);
  };

  return (
    <Card className="p-4">
      <Tabs 
        selectedKey={selectedTab} 
        onSelectionChange={(key) => setSelectedTab(key.toString())}
      >
        <Tab key="general" title="General Settings">
          <CardBody className="px-0 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">AI Assistant</h3>
                <p className="text-small text-default-500">Enable AI responses</p>
              </div>
              <Switch
                checked={currentConfig.isEnabled}
                onChange={(e) => setCurrentConfig({
                  ...currentConfig,
                  isEnabled: e.target.checked
                })}
              />
            </div>

            <Select
              label="Bot Personality"
              value={currentConfig.personality}
              onChange={(e) => setCurrentConfig({
                ...currentConfig,
                personality: e.target.value as ChatBotConfig['personality']
              })}
              isDisabled={!currentConfig.isEnabled}
            >
              <SelectItem key="professional" value="professional">Professional</SelectItem>
              <SelectItem key="friendly" value="friendly">Friendly</SelectItem>
              <SelectItem key="casual" value="casual">Casual</SelectItem>
            </Select>

            <div>
              <label className="text-small font-medium">Context Length</label>
              <Slider
                value={currentConfig.contextLength}
                // max={10}
                step={1}
                onChange={(value) => setCurrentConfig({
                  ...currentConfig,
                  contextLength: value as number
                })}
                isDisabled={!currentConfig.isEnabled}
              />
            </div>

            <div className="space-y-2">
              <label className="text-small font-medium">Trigger Keywords</label>
              {currentConfig.triggers.map((trigger, index) => (
                <Input
                  key={index}
                  value={trigger}
                  onChange={(e) => {
                    const newTriggers = [...currentConfig.triggers];
                    newTriggers[index] = e.target.value;
                    setCurrentConfig({
                      ...currentConfig,
                      triggers: newTriggers
                    });
                  }}
                  isDisabled={!currentConfig.isEnabled}
                  endContent={
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => {
                        const newTriggers = currentConfig.triggers.filter((_, i) => i !== index);
                        setCurrentConfig({
                          ...currentConfig,
                          triggers: newTriggers
                        });
                      }}
                    >
                      ×
                    </Button>
                  }
                />
              ))}
              <Button
                size="sm"
                variant="flat"
                onPress={() => setCurrentConfig({
                  ...currentConfig,
                  triggers: [...currentConfig.triggers, '']
                })}
                isDisabled={!currentConfig.isEnabled}
              >
                Add Trigger
              </Button>
            </div>

            <Textarea
              label="Default Responses"
              value={currentConfig.defaultResponses.join('\n')}
              onChange={(e) => setCurrentConfig({
                ...currentConfig,
                defaultResponses: e.target.value.split('\n').filter(r => r.trim())
              })}
              isDisabled={!currentConfig.isEnabled}
            />
          </CardBody>
        </Tab>

        <Tab key="auto-reply" title="Auto-Reply Rules">
          <CardBody className="px-0 space-y-4">
            {rules.map((rule, index) => (
              <Card key={rule.id} className="p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-small font-medium">Rule {index + 1}</h4>
                  <Switch
                    checked={rule.isEnabled}
                    onChange={(e) => handleUpdateRule(index, { 
                      isEnabled: e.target.checked 
                    })}
                  />
                </div>

                <Input
                  label="Trigger Pattern"
                  value={rule.pattern}
                  onChange={(e) => handleUpdateRule(index, { 
                    pattern: e.target.value 
                  })}
                />

                <Textarea
                  label="Response"
                  value={rule.response}
                  onChange={(e) => handleUpdateRule(index, { 
                    response: e.target.value 
                  })}
                />

                <Select
                  label="Schedule"
                  value={rule.schedule}
                  onChange={(e) => handleUpdateRule(index, { 
                    schedule: e.target.value as AutoReplyRule['schedule']
                  })}
                >
                  <SelectItem key="always" value="always">Always</SelectItem>
                  <SelectItem key="outside-hours" value="outside-hours">Outside Business Hours</SelectItem>
                  <SelectItem key="custom" value="custom">Custom Schedule</SelectItem>
                </Select>

                {rule.schedule === 'custom' && rule.customSchedule && (
                  <div className="space-y-2">
                    <Input
                      type="time"
                      label="Start Time"
                      value={rule.customSchedule.startTime}
                      onChange={(e) => handleUpdateRule(index, {
                        // customSchedule: {
                        //   ...rule.customSchedule,
                        //   startTime: e.target.value
                        // }
                      })}
                    />
                    <Input
                      type="time"
                      label="End Time"
                      value={rule.customSchedule.endTime}
                      onChange={(e) => handleUpdateRule(index, {
                        // customSchedule: {
                        //   ...rule.customSchedule,
                        //   endTime: e.target.value
                        // }
                      })}
                    />
                  </div>
                )}

                <Button
                  color="danger"
                  variant="light"
                  onPress={() => setRules(rules.filter((_, i) => i !== index))}
                >
                  Remove Rule
                </Button>
              </Card>
            ))}

            <Button
              color="primary"
              variant="flat"
              onPress={handleAddRule}
            >
              Add Rule
            </Button>
          </CardBody>
        </Tab>
      </Tabs>

      <Button
        color="primary"
        className="mt-4"
        onPress={() => {
          onUpdate(currentConfig);
          onUpdateAutoReply?.(rules);
        }}
      >
        Save Settings
      </Button>
    </Card>
  );
};

export default BotSettings;