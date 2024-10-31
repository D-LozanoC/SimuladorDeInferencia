package main;

import javax.swing.*;
import java.awt.*;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Fact {
    String attribute;
    String value;

    public Fact(String attribute, String value) {
        this.attribute = attribute;
        this.value = value;
    }

    @Override
    public String toString() {
        return attribute + " = " + value;
    }
}

class Condition extends Fact {
    public Condition(String attribute, String value) {
        super(attribute, value);
    }
}

class Hypothesis {
    Fact fact;
    SingleLinkedList<Condition> conditions;

    public Hypothesis(Fact fact, Condition[] conditions) {
        this.fact = fact;
        this.conditions = new SingleLinkedList<>(Arrays.asList(conditions));
    }

    @Override
    public String toString() {
        return fact.toString();
    }
}

class SingleLinkedList<T> implements Iterable<T> {
    Node<T> head;

    public SingleLinkedList(List<T> list) {
        for (T item : list) {
            addLast(item);
        }
    }

    private void addLast(T item) {
        Node<T> newNode = new Node<>(item);
        if (head == null) {
            head = newNode;
        } else {
            Node<T> current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        Node<T> current = head;
        while (current != null) {
            sb.append(current.data).append(" ");
            current = current.next;
        }
        return sb.toString();
    }

    @Override
    public java.util.Iterator<T> iterator() {
        return new java.util.Iterator<T>() {
            Node<T> current = head;

            public boolean hasNext() {
                return current != null;
            }

            public T next() {
                T data = current.data;
                current = current.next;
                return data;
            }
        };
    }

    private static class Node<T> {
        T data;
        Node<T> next;

        public Node(T data) {
            this.data = data;
        }
    }
}

public class KnowledgeBaseGUI {
    private JTextArea factsArea;
    private JTextArea hypothesesArea;
    private JTextArea outputArea;

    public KnowledgeBaseGUI() {
        JFrame frame = new JFrame("Sistema de Gestión de Conocimientos");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(600, 400);

        factsArea = createPlaceholderTextArea("Ingrese los hechos aquí (ej. color rojo)");
        hypothesesArea = createPlaceholderTextArea("Ingrese las hipótesis aquí (ej. fruta manzana color rojo)");
        outputArea = new JTextArea(10, 30);
        outputArea.setEditable(false);

        JButton runButton = new JButton("Ejecutar encadenamiento hacia adelante");
        runButton.addActionListener(e -> {
            ArrayList<Fact> facts = readFactsFromInput();
            ArrayList<Hypothesis> hypotheses = readHypothesesFromInput();
            ArrayList<Fact> deducedFacts = forwardChaining(facts, hypotheses);
            displayDeducedFacts(deducedFacts);
        });

        JPanel panel = new JPanel();
        panel.setLayout(new BorderLayout());

        JPanel inputPanel = new JPanel();
        inputPanel.setLayout(new GridLayout(1, 2));
        inputPanel.add(new JScrollPane(factsArea));
        inputPanel.add(new JScrollPane(hypothesesArea));

        panel.add(inputPanel, BorderLayout.CENTER);
        panel.add(runButton, BorderLayout.SOUTH);

        frame.add(panel, BorderLayout.CENTER);
        frame.add(new JScrollPane(outputArea), BorderLayout.SOUTH);
        frame.setVisible(true);
    }

    private JTextArea createPlaceholderTextArea(String placeholderText) {
        JTextArea textArea = new JTextArea(10, 20);
        textArea.setText(placeholderText);
        textArea.setForeground(Color.GRAY);

        textArea.addFocusListener(new FocusListener() {
            @Override
            public void focusGained(FocusEvent e) {
                if (textArea.getText().equals(placeholderText)) {
                    textArea.setText("");
                    textArea.setForeground(Color.BLACK);
                }
            }

            @Override
            public void focusLost(FocusEvent e) {
                if (textArea.getText().isEmpty()) {
                    textArea.setForeground(Color.GRAY);
                    textArea.setText(placeholderText);
                }
            }
        });
        return textArea;
    }

    private ArrayList<Fact> readFactsFromInput() {
        ArrayList<Fact> facts = new ArrayList<>();
        String[] lines = factsArea.getText().split("\\n");
        for (String line : lines) {
            String[] parts = line.split(" ");
            if (parts.length == 2) {
                facts.add(new Fact(parts[0], parts[1]));
            }
        }
        return facts;
    }

    private ArrayList<Hypothesis> readHypothesesFromInput() {
        ArrayList<Hypothesis> hypotheses = new ArrayList<>();
        String[] lines = hypothesesArea.getText().split("\\n");
        for (String line : lines) {
            String[] parts = line.split(" ");
            if (parts.length >= 3 && (parts.length - 2) % 2 == 0) {
                Fact fact = new Fact(parts[0], parts[1]);
                ArrayList<Condition> conditions = new ArrayList<>();
                for (int i = 2; i < parts.length; i += 2) {
                    conditions.add(new Condition(parts[i], parts[i + 1]));
                }
                hypotheses.add(new Hypothesis(fact, conditions.toArray(new Condition[0])));
            }
        }
        return hypotheses;
    }

    private ArrayList<Fact> forwardChaining(ArrayList<Fact> facts, ArrayList<Hypothesis> hypotheses) {
        ArrayList<Fact> deducedFacts = new ArrayList<>(facts);
        boolean factsAdded;
        do {
            factsAdded = false;
            for (Hypothesis hypothesis : hypotheses) {
                if (canApplyRule(hypothesis, deducedFacts)) {
                    if (!deducedFacts.contains(hypothesis.fact)) {
                        deducedFacts.add(hypothesis.fact);
                        factsAdded = true;
                    }
                }
            }
        } while (factsAdded);
        return deducedFacts;
    }


    private boolean canApplyRule(Hypothesis hypothesis, ArrayList<Fact> currentFacts) {
        for (Condition condition : hypothesis.conditions) {
            boolean conditionMet = false;
            for (Fact fact : currentFacts) {
                if (condition.attribute.equals(fact.attribute) && condition.value.equals(fact.value)) {
                    conditionMet = true;
                    break;
                }
            }
            if (!conditionMet) {
                return false;
            }
        }
        return true;
    }

    private void displayDeducedFacts(ArrayList<Fact> deducedFacts) {
        outputArea.setText("Hechos deducidos:\n");
        for (Fact fact : deducedFacts) {
            outputArea.append(fact.toString() + "\n");
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(KnowledgeBaseGUI::new);
    }
}
