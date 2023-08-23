import matplotlib.pyplot as plt

def plot_data():
    # Data points
    sample_size = [1, 2, 3, 5, 10, 20, 50, 100, 200, 500]
    average_score = [5.07, 0.91, 0.89, 4.82, 4.80, 4.80, 4.79, 4.79, 4.77, 4.77, 4.77]

    # Create the plot
    plt.plot(sample_size, average_score, marker='o', linestyle='-', color='b', label='Average Score')

    # Add labels and title
    plt.xlabel('Sample Size')
    plt.ylabel('Average Score')
    plt.title('Average Score vs. Sample Size')

    # Show the plot
    plt.grid(True)
    plt.legend()
    plt.xscale('log')  # Set logarithmic scale for the x-axis (optional)
    plt.show()

# Call the function to plot the data
plot_data()
